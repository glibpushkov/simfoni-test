from uuid import uuid4

from django.contrib.gis.db import models


class UUIDPKCoreModel(models.Model):
    uuid = models.UUIDField(primary_key=True, editable=False)

    class Meta:
        abstract = True

    def save(self, *args, **kwargs):
        if not self.uuid:
            self.uuid = uuid4()
        super(UUIDPKCoreModel, self).save(*args, **kwargs)
