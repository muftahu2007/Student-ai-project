from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_studyschedule'),
    ]

    operations = [
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
