from rest_framework import serializers
from .models import Request, Position, Payment


class PaymentSerializer(serializers.ModelSerializer):
    executor = serializers.ReadOnlyField(source='executor.user.username')

    class Meta:
        model = Payment
        fields = ['executor', 'gmp', 'date_created', 'is_accepted']


class PositionSerializer(serializers.ModelSerializer):
    request = serializers.ReadOnlyField(source='request.name')
    payment = PaymentSerializer(source='positions', many=True)
    stage = serializers.SerializerMethodField()

    def get_stage(self, obj):
        return obj.changes.last().stage
        
    class Meta:
        model = Position
        fields = ['id', 'name', 'stage', 'okpd2', 'okei', 'amount', 'payment', 'request']


class RequestSerializer(serializers.ModelSerializer):
    positions = PositionSerializer(many=True, read_only=True)

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # removing request name from position serailizer, cuz
        # on requestdetail page it would look redundant
        for name in representation:
            if name == 'positions':
                for position in representation[name]:
                    # make sure request is the last field on 
                    # PositionSerializer
                    position.popitem()
        return representation

    class Meta:
        model = Request
        fields = ['name', 'positions']