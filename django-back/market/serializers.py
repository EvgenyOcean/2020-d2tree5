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


class RequestSerializer(serializers.HyperlinkedModelSerializer):
    request_name = serializers.ReadOnlyField(source='name')
    positions = PositionSerializer(many=True, read_only=True)
    owner = serializers.HyperlinkedRelatedField(
        source='owner.user',
        lookup_field='username',
        view_name='customer-detail',
        read_only=True,
    )

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
        fields = ['request_name', 'owner', 'positions']


class OfferSerializer(serializers.HyperlinkedModelSerializer):
    executor = serializers.HyperlinkedRelatedField(
        read_only=True,
        source='executor.user',
        lookup_field='username',
        view_name='executor-detail'
    )
    request_name = serializers.ReadOnlyField(source='position.request.name')
    position_name = serializers.ReadOnlyField(source='position.name')
    class Meta:
        model = Payment
        fields = ['request_name', 'position_name', 'gmp', 'date_created', 'is_accepted', 'executor']