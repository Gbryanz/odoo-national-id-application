{
    'name': 'National ID Application',
    'version': '1.0',
    'category': 'Administration',
    'summary': 'Online National ID Application System',
    'description': """
        This module provides a web interface for National ID applications with an approval workflow.
    """,
    'depends': ['base', 'mail', 'web', 'portal'],
    'data': [
        'security/security.xml',
        'security/ir.model.access.csv',
        'views/national_id_views.xml',
        'views/national_id_templates.xml',
    ],
    'application': True,
    'installable': True,
    'auto_install': False,
}
