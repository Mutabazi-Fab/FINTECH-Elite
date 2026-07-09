from django.db import models
from django.contrib.auth.models import User
from django.core.validators import RegexValidator
from django.utils import timezone

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone_number = models.CharField(
        max_length=10,
        validators=[RegexValidator(r'^\d{10}$', 'Phone number must be exactly 10 digits.')]
    )

    def __str__(self):
        return f"{self.user.username}'s Profile"

class Category(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Transaction(models.Model):
    TRANSACTION_TYPES = [
        ('INCOME', 'Income'),
        ('EXPENSE', 'Expense'),
    ]
    PAYMENT_METHODS = [
        ('PHONE', 'Mobile Money (Phone)'),
        ('CARD', 'Bank Card'),
        ('SALARY', 'Salary Deposit'),
        ('LOAN', 'Loan Deposit'),
        ('OTHER', 'Other'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    amount = models.FloatField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    date = models.DateField()
    type = models.CharField(max_length=10, choices=TRANSACTION_TYPES, default='EXPENSE')
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHODS, default='OTHER')

    def __str__(self):
        return f"{self.type}: {self.user.username} - {self.amount}"

class LoanRequest(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    amount = models.FloatField()
    tenure_months = models.IntegerField(default=12)
    interest_rate = models.FloatField(default=15.0)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='PENDING')
    rejection_reason = models.TextField(blank=True, null=True)
    is_credited = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Loan Request: {self.user.username} - RWF {self.amount} ({self.status})"

    def save(self, *args, **kwargs):
        if self.status == 'APPROVED' and not self.is_credited:
            try:
                loan_category = Category.objects.get(id=10)
            except Category.DoesNotExist:
                loan_category, _ = Category.objects.get_or_create(name='Income')
                
            Transaction.objects.create(
                user=self.user,
                amount=self.amount,
                category=loan_category,
                date=timezone.now().date(),
                type='INCOME',
                payment_method='LOAN'
            )
            self.is_credited = True
            
        super().save(*args, **kwargs)
