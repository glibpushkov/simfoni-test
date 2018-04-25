from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

from revenue.api.serializers.revenue_group import RevenueGroupSerializer
from revenue.models.revenue_group import RevenueGroup


# APIViews was used instead of ViewSets because it's more verbose/explicit.
# Such declarative way is more clear to configure different permissions and serializers for each http method.
# (when business logic becomes more complicated)


class RevenueGroupListCreateAPIView(generics.ListCreateAPIView):
    queryset = RevenueGroup.objects.all()
    serializer_class = RevenueGroupSerializer


class RevenueGroupRetrieveUpdateDestroyAPIView(generics.ListCreateAPIView):
    serializer_class = RevenueGroupSerializer


class RevenueRetrieveUploadAPIView(APIView):

    def get(self, request):
        groups = RevenueGroup.objects.all()
        data = {}
        for group in groups:
            data = {
                group.name: 33
            }

        return Response(
            data,
            status=status.HTTP_200_OK
        )

    def post(self, request):
        upload_statistic = {
            'uploaded': 300,
            'min': 1000,
            'max': 10000,
        }
        return Response(
            upload_statistic,
            status=status.HTTP_201_CREATED
        )
