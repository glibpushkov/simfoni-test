import uuid

from django.db import models
from django.utils.translation import ugettext_lazy as _


class AbstractCreateUpdate(models.Model):
    created_at = models.DateTimeField(_('Created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Updated at'), auto_now=True)

    class Meta:
        abstract = True


class AbstractUUIDPk(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True)

    class Meta:
        abstract = True


class AbstractBaseModel(AbstractCreateUpdate, AbstractUUIDPk):
    """
    Base solastis abstract model, that include `created_at`, `updated_at`, `is_deleted` fields.
    And use `uuid` as primary field.
    """
    class Meta:
        abstract = True
