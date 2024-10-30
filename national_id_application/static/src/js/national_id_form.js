odoo.define('national_id_application.form', function (require) {
    'use strict';

    var publicWidget = require('web.public.widget');
    var core = require('web.core');
    var _t = core._t;

    publicWidget.registry.NationalIDForm = publicWidget.Widget.extend({
        selector: '.national-id-form',
        events: {
            'change input[type="file"]': '_onFileChange',
            'submit form': '_onFormSubmit',
        },

        /**
         * @override
         */
        start: function () {
            var def = this._super.apply(this, arguments);
            this._initializeForm();
            return def;
        },

        /**
         * Initialize form elements and validation
         */
        _initializeForm: function () {
            var self = this;
            // Initialize date picker with max date as today
            var today = new Date().toISOString().split('T')[0];
            this.$('input[type="date"]').attr('max', today);

            // Initialize phone number validation
            this.$('input[name="phone"]').on('input', function () {
                var phone = $(this).val().replace(/\D/g, '');
                if (phone.length > 10) {
                    phone = phone.substr(0, 10);
                }
                $(this).val(phone);
            });
        },

        /**
         * Handle file input changes
         * @param {Event} ev
         */
        _onFileChange: function (ev) {
            var file = ev.target.files[0];
            var fieldName = $(ev.target).attr('name');

            if (file) {
                // Validate file size (max 5MB)
                if (file.size > 5 * 1024 * 1024) {
                    alert(_t("File size must be less than 5MB"));
                    ev.target.value = '';
                    return;
                }

                // Validate file type for photos
                if (fieldName === 'photo') {
                    if (!file.type.match('image.*')) {
                        alert(_t("Please select an image file"));
                        ev.target.value = '';
                        return;
                    }

                    // Show image preview
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        var preview = $('<img>', {
                            src: e.target.result,
                            class: 'photo-preview'
                        });
                        $(ev.target).siblings('.photo-preview').remove();
                        $(ev.target).after(preview);
                    };
                    reader.readAsDataURL(file);
                }

                // Validate file type for LC letter
                if (fieldName === 'lc_letter') {
                    if (!file.type.match('application/pdf') && !file.type.match('image.*')) {
                        alert(_t("Please select a PDF or image file"));
                        ev.target.value = '';
                        return;
                    }
                }
            }
        },

        /**
         * Handle form submission
         * @param {Event} ev
         */
        _onFormSubmit: function (ev) {
            var self = this;
            var $form = $(ev.currentTarget);
            var isValid = this._validateForm($form);

            if (!isValid) {
                ev.preventDefault();
                return;
            }

            // Show loading state
            $form.find('button[type="submit"]')
                .prop('disabled', true)
                .html('<i class="fa fa-spinner fa-spin"></i> Submitting...');
        },

        /**
         * Validate form inputs
         * @param {jQuery} $form
         * @returns {Boolean}
         */
        _validateForm: function ($form) {
            var isValid = true;

            // Clear previous error messages
            $form.find('.error-message').remove();
            $form.find('.is-invalid').removeClass('is-invalid');

            // Validate required fields
            $form.find('[required]').each(function () {
                if (!$(this).val()) {
                    isValid = false;
                    $(this).addClass('is-invalid');
                    $(this).after($('<div>', {
                        class: 'error-message text-danger',
                        text: _t("This field is required")
                    }));
                }
            });

            // Validate email format
            var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            var $emailInput = $form.find('input[name="email"]');
            if ($emailInput.val() && !emailRegex.test($emailInput.val())) {
                isValid = false;
                $emailInput.addClass('is-invalid');
                $emailInput.after($('<div>', {
                    class: 'error-message text-danger',
                    text: _t("Please enter a valid email address")
                }));
            }

            // Validate phone number format
            var $phoneInput = $form.find('input[name="phone"]');
            if ($phoneInput.val() && $phoneInput.val().length < 10) {
                isValid = false;
                $phoneInput.addClass('is-invalid');
                $phoneInput.after($('<div>', {
                    class: 'error-message text-danger',
                    text: _t("Please enter a valid phone number")
                }));
            }

            return isValid;
        },
    });

    return publicWidget.registry.NationalIDForm;
});

