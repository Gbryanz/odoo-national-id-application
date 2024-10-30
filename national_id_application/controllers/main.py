from odoo import http
from odoo.http import request

class NationalIDController(http.Controller):
    @http.route(['/national-id-application'], type='http', auth='public', website=True)
    def national_id_form(self, **kwargs):
        return request.render('national_id_application.application_form_template', {})

    @http.route(['/national-id-application/submit'], type='http', auth='public', website=True, methods=['POST'])
    def submit_application(self, **post):
        vals = {
            'applicant_name': post.get('applicant_name'),
            'date_of_birth': post.get('date_of_birth'),
            'gender': post.get('gender'),
            'phone': post.get('phone'),
            'email': post.get('email'),
            'address': post.get('address'),
            'photo': post.get('photo'),
            'lc_letter': post.get('lc_letter'),
            'state': 'submitted'
        }
        application = request.env['national.id.application'].sudo().create(vals)
        return request.render('national_id_application.application_submitted', {
            'application': application
        })

