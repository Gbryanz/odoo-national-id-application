from odoo import models, fields, api, _
from odoo.exceptions import UserError

class NationalIDApplication(models.Model):
    _name = 'national.id.application'
    _description = 'National ID Application'
    _inherit = ['mail.thread', 'mail.activity.mixin']

    name = fields.Char(string='Application Number', readonly=True, copy=False, default='New')
    applicant_name = fields.Char(string='Full Name', required=True, tracking=True)
    date_of_birth = fields.Date(string='Date of Birth', required=True, tracking=True)
    gender = fields.Selection([
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other')
    ], required=True, tracking=True)
    phone = fields.Char(string='Phone Number', required=True, tracking=True)
    email = fields.Char(string='Email', required=True, tracking=True)
    address = fields.Text(string='Residential Address', required=True, tracking=True)
    photo = fields.Binary(string='Passport Photo', required=True, attachment=True)
    lc_letter = fields.Binary(string='LC Reference Letter', required=True, attachment=True)
    state = fields.Selection([
        ('draft', 'Draft'),
        ('submitted', 'Submitted'),
        ('stage1', 'First Approval'),
        ('stage2', 'Final Approval'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected')
    ], default='draft', string='Status', tracking=True)

    # Add company_id field to link the record to a specific company
    company_id = fields.Many2one('res.company', string='Company', default=lambda self: self.env.company)

    @api.model
    def create(self, vals):
        if vals.get('name', 'New') == 'New':
            vals['name'] = self.env['ir.sequence'].next_by_code('national.id.application') or 'New'
        return super(NationalIDApplication, self).create(vals)

    def action_submit(self):
        self.state = 'submitted'
        self.message_post(body=_("Application submitted for review"))

    def action_approve_stage1(self):
        self.state = 'stage1'
        self.message_post(body=_("First approval completed by %s") % self.env.user.name)

    def action_approve_stage2(self):
        self.state = 'stage2'
        self.message_post(body=_("Final approval completed by %s") % self.env.user.name)

    def action_approve(self):
        self.state = 'approved'
        self.message_post(body=_("Application approved by %s") % self.env.user.name)

    def action_reject(self):
        self.state = 'rejected'
        self.message_post(body=_("Application rejected by %s") % self.env.user.name)
