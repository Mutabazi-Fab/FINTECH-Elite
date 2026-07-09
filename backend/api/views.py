from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .models import Transaction, Category, UserProfile, LoanRequest
from .serializers import TransactionSerializer, LoanRequestSerializer
from django.db.models import Sum

@api_view(['POST'])
def register(request):
    try:
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email', '')
        phone_number = request.data.get('phone_number')
        
        if not username or not password or not phone_number:
            return Response({"error": "Username, password, and phone number are required"}, status=400)
            
        if User.objects.filter(username=username).exists():
            return Response({"error": "This username is already taken."}, status=400)
            
        user = User.objects.create_user(
            username=username,
            password=password,
            email=email
        )
        
        # Create user profile with Rwandan phone number
        UserProfile.objects.create(user=user, phone_number=phone_number)
        
        return Response({"message": f"User '{username}' created successfully!"})
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['POST'])
def login(request):
    user = authenticate(
        username=request.data['username'],
        password=request.data['password']
    )

    if user:
        # Check if profile exists (for legacy users)
        profile, _ = UserProfile.objects.get_or_create(user=user, defaults={'phone_number': '0000000000'})
        return Response({
            "message": "Login successful",
            "id": user.id,
            "username": user.username,
            "phone_number": profile.phone_number
        })
    return Response({"error": "Invalid credentials"})

@api_view(['GET', 'POST', 'DELETE'])
def transactions(request):
    if request.method == 'POST':
        user_id = request.data.get('user')
        t_type = request.data.get('type', 'EXPENSE')
        
        # Balance Check for Expenses
        if t_type == 'EXPENSE' and user_id:
            income = Transaction.objects.filter(user_id=user_id, type='INCOME').aggregate(Sum('amount'))['amount__sum'] or 0
            expense = Transaction.objects.filter(user_id=user_id, type='EXPENSE').aggregate(Sum('amount'))['amount__sum'] or 0
            balance = income - expense
            
            if balance <= 0:
                return Response({"error": "Transaction Denied: You are out of money. Please deposit funds."}, status=403)

        serializer = TransactionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    if request.method == 'DELETE':
        transaction_id = request.GET.get('id')
        if not transaction_id:
            return Response({"error": "ID is required to delete"}, status=400)
        try:
            transaction = Transaction.objects.get(id=transaction_id)
            transaction.delete()
            return Response({"message": "Transaction deleted successfully"})
        except Transaction.DoesNotExist:
            return Response({"error": "Transaction not found"}, status=404)

    if request.method == 'GET':
        user_id = request.GET.get('user_id')
        data = Transaction.objects.all().order_by('-date')
        if user_id:
            data = data.filter(user_id=user_id)
        return Response(TransactionSerializer(data, many=True).data)

@api_view(['GET'])
def analytics(request):
    user_id = request.GET.get('user_id')
    
    # Base Queryset
    transactions = Transaction.objects.all()
    if user_id:
        transactions = transactions.filter(user_id=user_id)

    # Total Income
    income = transactions.filter(type='INCOME').aggregate(Sum('amount'))['amount__sum'] or 0
    # Total Expense
    expense = transactions.filter(type='EXPENSE').aggregate(Sum('amount'))['amount__sum'] or 0
    
    # Category breakdown for expenses only
    breakdown = transactions.filter(type='EXPENSE').values('category__name') \
        .annotate(total=Sum('amount'))
        
    return Response({
        "total_income": income,
        "total_expense": expense,
        "balance": income - expense,
        "breakdown": breakdown
    })

import os
from openai import OpenAI

# Initialize client (mocking key if not provided)
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY", "your-api-key-here"))

@api_view(['POST'])
def chat(request):
    question = request.data.get("question", "")
    if not question:
        return Response({"error": "Question is required"}, status=400)

    user_id = request.data.get("user_id")
    if not user_id:
        return Response({"error": "User ID is required for personalized context"}, status=400)

    # Constructing a "State-of-the-Art" Context for the AI
    user_transactions = Transaction.objects.filter(user_id=user_id)
    t_count = user_transactions.count()
    
    # Analysis for AI
    income = user_transactions.filter(type='INCOME').aggregate(Sum('amount'))['amount__sum'] or 0
    expense = user_transactions.filter(type='EXPENSE').aggregate(Sum('amount'))['amount__sum'] or 0
    balance = income - expense
    categories = list(Category.objects.values_list('name', flat=True))
    
    # Calculate top spending category
    top_cat = user_transactions.filter(type='EXPENSE').values('category__name').annotate(total=Sum('amount')).order_by('-total').first()
    top_cat_name = top_cat['category__name'] if top_cat else "N/A"
    top_cat_amt = top_cat['total'] if top_cat else 0

    project_context = f"""
    You are the 'FINTECH GROUP 4' AI Assistant. 
    Financial Profile:
    - Total Income: RWF {income}
    - Total Expenses: RWF {expense}
    - Current Balance: RWF {balance}
    - Top Spending: {top_cat_name} (RWF {top_cat_amt})
    - Transactions Count: {t_count}
    """

    # Check if key is actually set
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key or api_key == "your-api-key-here":
        q = question.lower()
        
        if "save" in q or "recommendation" in q or "advice" in q or "spending" in q:
            if balance < 0:
                response = f"URGENT: Your current balance is negative (RWF {balance}). You have spent RWF {expense} but only earned RWF {income}. I recommend immediately reducing your spending on {top_cat_name}, which is your highest expense."
            elif expense > (income * 0.7):
                response = f"Your expenses (RWF {expense}) are over 70% of your income. To save effectively, try to keep expenses below 50%. Focus on reducing your {top_cat_name} costs."
            else:
                response = f"Good job! You have a healthy balance of RWF {balance}. To save even more, consider setting aside 20% of your RWF {income} income before spending on {top_cat_name}."
        elif "loan" in q or "borrow" in q:
            response = f"With your current balance of RWF {balance}, our loan calculator can help you estimate monthly payments. Remember, we require 3 months of income proof and a valid ID."
        elif "balance" in q or "how much" in q:
            response = f"Your current net balance is RWF {balance}. Total Income: RWF {income} | Total Expenses: RWF {expense}."
        elif "hello" in q or "hi" in q:
            response = f"Hello! I am your Fintech AI. I see you have {t_count} transactions and a balance of RWF {balance}. How can I help you optimize your savings today?"
        else:
            response = f"I've analyzed your data: You've spent RWF {expense} across {len(categories)} categories. Your highest spending is on {top_cat_name}. Is there something specific you'd like to know about these patterns?"
            
        return Response({"response": response})

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": project_context},
                {"role": "user", "content": question}
            ]
        )
        return Response({"response": response.choices[0].message.content})
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['GET'])
def recommendations(request):
    user_id = request.GET.get('user_id')
    if not user_id:
        return Response({"error": "User ID is required"}, status=400)

    transactions = Transaction.objects.filter(user_id=user_id)
    if not transactions.exists():
        return Response(["No transactions found. Add some transactions to get recommendations."])

    total = sum([t.amount for t in transactions])

    category_totals = {}
    for t in transactions:
        name = t.category.name.lower()
        category_totals[name] = category_totals.get(name, 0) + t.amount

    advice = []

    # Rule-Based Logic
    for cat, amt in category_totals.items():
        ratio = amt / total
        percentage = int(ratio * 100)
        
        if cat == 'food' and ratio > 0.3:
            advice.append(f"You spent {percentage}% on food. Consider reducing it to save more.")
        elif cat == 'transport' and ratio > 0.3:
            advice.append(f"You can save more by reducing transport. Currently at {percentage}%.")
        elif ratio > 0.4:
            advice.append(f"You spent {percentage}% on {cat}. Consider reducing.")

    if total < 5000:
        advice.append("Try increasing your savings.")

    # Simple time-based increase warning (mocking behavior for the prompt rule)
    if total > 50000:
        advice.append("Warning: Your overall spending has increased over time. Try focusing on your savings.")

    if not advice:
         advice.append("Your spending is well balanced! Keep it up.")

    return Response(advice)

@api_view(['GET', 'POST'])
def loan_requests(request):
    if request.method == 'POST':
        data = request.data.copy()
        data['status'] = 'PENDING'
        serializer = LoanRequestSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
        
    if request.method == 'GET':
        user_id = request.GET.get('user_id')
        requests = LoanRequest.objects.all().order_by('-created_at')
        if user_id:
            requests = requests.filter(user_id=user_id)
        serializer = LoanRequestSerializer(requests, many=True)
        return Response(serializer.data)
