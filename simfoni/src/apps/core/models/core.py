from django.contrib.gis.db import models

from .uuidpk import UUIDPKCoreModel


class CoreQuerySet(models.QuerySet):
    def active(self):
        return self.filter(is_active=True)

    def inactive(self):
        return self.filter(is_active=False)


class CoreManager(models.GeoManager):
    def get_queryset(self):
        return CoreQuerySet(self.model, using=self._db)

    def active(self):
        return self.get_queryset().active()

    def inactive(self):
        return self.get_queryset().inactive()


class CoreModel(UUIDPKCoreModel):
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True, db_index=True)

    objects = CoreManager()

    class Meta:
        abstract = True
        get_latest_by = "created"

    def __str__(self):
        return str(self.pk)

    def activate(self):
        if not self.is_active:
            self.is_active = True
            self.save(update_fields=['is_active', 'updated'] if self.pk else None)

    def deactivate(self):
        if self.is_active:
            self.is_active = False
            self.save(update_fields=['is_active', 'updated'] if self.pk else None)
