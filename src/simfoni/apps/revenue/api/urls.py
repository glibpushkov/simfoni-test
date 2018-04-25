from django.conf.urls import url

from revenue.api import views


urlpatterns = [
    url(r'^revenue-groups/$', views.RevenueGroupListCreateAPIView.as_view(), name='revenue-group-list'),
    url(
        r'^revenue-groups/<uuid:pk>/$',
        views.RevenueGroupRetrieveUpdateDestroyAPIView.as_view(),
        name='revenue-group-detail'
    ),
    url(r'^revenue/$', views.RevenueRetrieveUploadAPIView.as_view(), name='revenue'),

]
