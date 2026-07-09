from django.db import models
from django.contrib.auth.models import User
from django.core.validators import RegexValidator

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
