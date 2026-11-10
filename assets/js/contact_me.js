---
---
$(function() {

  $("#contactForm input,#contactForm textarea").jqBootstrapValidation({
    preventSubmit: true,
    submitError: function($form, event, errors) {
      // additional error messages or events
    },
    submitSuccess: function($form, event) {
      event.preventDefault(); // prevent default submit behaviour
      
      // Get values from form
      var name = $("input#name").val() || "";
      var email = $("input#email").val() || "";
      var company = $("input#company").val() || "";
      var phone = $("input#phone").val() || "";
      var productCategory = $("select#product_category").val() || "Not specified";
      var serviceRequired = $("select#service_required").val() || "Not specified";
      var message = $("textarea#message").val() || "";
      
      var firstName = name;
      if (firstName.indexOf(' ') >= 0) {
        firstName = name.split(' ').slice(0, -1).join(' ');
      }
      
      var $btn = $("#sendMessageButton");
      $btn.prop("disabled", true).text("Sending...");

      var postData = {
        name: name,
        email: email,
        company: company,
        phone: phone,
        product_category: productCategory,
        service_required: serviceRequired,
        message: message,
        _subject: "Halvana Tech - Project Inquiry from " + name,
        _template: "table",
        _captcha: "false"
      };

      $.ajax({
        url: "https://formsubmit.co/ajax/contact@halvanatech.com",
        type: "POST",
        dataType: "json",
        data: postData,
        cache: false,
        headers: {
          'Accept': 'application/json'
        },
        success: function(data) {
          if (data && (data.success === "true" || data.success === true)) {
            $('#success').html("<div class='alert alert-success alert-dismissible fade show' role='alert'>" +
              "<strong>Thank you, " + firstName + "!</strong> Your inquiry has been sent to contact@halvanatech.com. We will review your project requirements and get in touch shortly." +
              "<button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button>" +
              "</div>");
            $('#contactForm').trigger("reset");
          } else {
            var note = (data && data.message) ? data.message : "Your inquiry has been received.";
            $('#success').html("<div class='alert alert-info alert-dismissible fade show' role='alert'>" +
              "<strong>Inquiry Received:</strong> " + note +
              "<button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button>" +
              "</div>");
            $('#contactForm').trigger("reset");
          }
        },
        error: function() {
          var mailtoSubject = encodeURIComponent("Project Inquiry from " + name);
          var mailtoBody = encodeURIComponent("Name: " + name + "\nEmail: " + email + "\nCompany: " + company + "\nPhone: " + phone + "\nProduct Category: " + productCategory + "\nService Required: " + serviceRequired + "\n\nMessage:\n" + message);
          var mailtoLink = "mailto:contact@halvanatech.com?subject=" + mailtoSubject + "&body=" + mailtoBody;

          $('#success').html("<div class='alert alert-warning alert-dismissible fade show' role='alert'>" +
            "<strong>Direct Email Option:</strong> If you prefer to send directly via your email client, you can send your inquiry immediately:<br><br>" +
            "<a href='" + mailtoLink + "' class='btn btn-warning font-weight-bold text-dark mt-2'><i class='fas fa-envelope mr-1'></i> Click to Send via Email App to contact@halvanatech.com</a>" +
            "<button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button>" +
            "</div>");
        },
        complete: function() {
          setTimeout(function() {
            $btn.prop("disabled", false).text("Discuss Your Project");
          }, 1500);
        }
      });
    },
    filter: function() {
      return $(this).is(":visible");
    }
  });

  $("a[data-toggle=\"tab\"]").click(function(e) {
    e.preventDefault();
    $(this).tab("show");
  });
});

/* When clicking on input, clear old status boxes */
$('#name, #email, #message').focus(function() {
  $('#success').html('');
});
