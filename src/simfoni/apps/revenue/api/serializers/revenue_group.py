from rest_framework import serializers

from revenue.models.revenue_group import RevenueGroup


class RevenueGroupSerializer(serializers.ModelSerializer):

    class Meta:
        model = RevenueGroup
        fields = '__all__'
