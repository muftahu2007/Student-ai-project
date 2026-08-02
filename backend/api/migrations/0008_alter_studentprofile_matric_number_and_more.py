from django.db import migrations, models


def remove_duplicate_matric_numbers(apps, schema_editor):
    """
    Before adding the unique constraint on matric_number, delete all duplicate
    StudentProfile rows keeping only the most recently created one per matric_number.
    """
    StudentProfile = apps.get_model('api', 'StudentProfile')

    seen = {}
    # Order by created_at so the latest record wins
    for profile in StudentProfile.objects.order_by('created_at'):
        key = profile.matric_number.strip().upper() if profile.matric_number else ''
        if key in seen:
            # Delete the older duplicate
            seen[key].delete()
        seen[key] = profile


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_studyschedule'),
    ]

    operations = [
        # Step 1: Remove duplicate matric numbers before adding the unique constraint
        migrations.RunPython(
            remove_duplicate_matric_numbers,
            reverse_code=migrations.RunPython.noop,
        ),
        # Step 2: Now it's safe to enforce uniqueness
        migrations.AlterField(
            model_name='studentprofile',
            name='matric_number',
            field=models.CharField(max_length=100, unique=True),
        ),
        migrations.AlterField(
            model_name='studentprofile',
            name='program',
            field=models.CharField(blank=True, default='', max_length=255),
        ),
    ]
