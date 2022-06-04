// Take action when the document loads
$(document).ready(function () {
    // Retrieving the user id from the html document
    user = $('body > p').attr('id')

    // Retriveing all classrooms from html document
    var all_classes = $('.students > div');
    classes = Object.assign([], all_classes)

    // Retriving id of the school that loads up first
    first_sch = $('.selected_school').attr('id')

    // Action to be taken when 'register student' button is clicked
    $('#register_student').on('click', function() {
        $('.stu_reg_form').toggleClass('hide_cards show_cards')
    });

    // Action to be taken when a new student is to be created
    const stu_reg_form  = document.getElementById('new_student');
    stu_reg_form.addEventListener('submit', (event) => {
        event.preventDefault()
        const name = (stu_reg_form.elements['name']).value;
        const age = (stu_reg_form.elements['age']).value;
        const sex = (stu_reg_form.elements['sex']).value;
        const parent_phone = (stu_reg_form.elements['parent_phone']).value
        const pwd = (stu_reg_form.elements['password']).value;
        const sch_id = $('.selected_school').attr('id')
        const cls = $('#stu_sel > div > h4').text()
        const cls_id = $('#stu_sel > div > h4').attr('id')
        let post_dict = {}
        post_dict['name'] = name
        post_dict['age'] = age
        post_dict['sex'] = sex
        post_dict['parent_phone'] = parent_phone
        post_dict['cls_id'] = cls_id
        post_dict['cls'] = cls
        post_dict['password'] = pwd

        // API call to add a student to the database
        $.ajax({
            type: 'POST',
            url: '/api/v1/schools/' + sch_id + '/students',
            data: JSON.stringify(post_dict),
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {
                if (data['code'] === 'Created') {
                    // Operation success
                    alert("Student added!")
                    stu_reg_form.reset()
                    $('.stu_reg_form').toggleClass('hide_cards show_cards')
                    setTimeout("location.reload(true);", 1500);
                }
                else if (data['code'] === 'Student exists') {
                    // If student exists
                    $('.message').html('<p>Student with that name exists already!</p>');
                    $('#stu_form_pop').css('background-color', 'lightcoral')
                    $('#stu_form_pop').toggleClass('hide_cards show_cards');
                }
                else if (data['code'] === 'Wrong password') {
                    // If provided password is wrong
                    $('.message').html('<p>Wrong password!</p>');
                    $('#stu_form_pop').css('background-color', 'lightcoral')
                    $('#stu_form_pop').toggleClass('hide_cards show_cards');
                }
                else {
                    // Any other error
                    $('.message').html('<p>Error</p>');
                    $('#stu_form_pop').css('background-color', 'lightcoral')
                    $('#stu_form_pop').toggleClass('hide_cards show_cards');
                }
            }
        });
    });


    // When a student card is clicked to get complete view
    $('body').on('click', '.student', function(event) {
        $(this).removeClass('shrink_view')
        $(this).addClass('expand_view')
        $(this).css('color', 'black')
        const id = $(this).attr('id')
        $('.student#' + id + '> .stu_info').removeClass('hide_cards')
        $('.student#' + id + '> .stu_info').addClass('show_cards')
        $('.student#' + id).siblings().removeClass('hide_cards')
    })


    // When 'close icon' is clicked to minimize student view
    $('body').on('click', '.close_view', function() {
        id = $(this).parent().siblings().attr('id')
        $('.student#' + id + ' > .stu_info').removeClass('show_cards')
        $('.student#' + id + ' > .stu_info').addClass('hide_cards')
        $('.student#' + id).css('color', 'grey')
        $('.student#' + id).removeClass('expand_view')
        $('.student#' + id).addClass('shrink_view')
        $(this).parent().addClass('hide_cards')
    })


    // Action to be taken when 'edit' under student is clicked
    $('body').on('click', '.edit_obj > p', function() {
        id = $(this).siblings('form').attr('id')
        $('.signup_input_group#' + id).toggleClass('hide_cards show_cards')
    })

    // Action to be taken when 'edit student' button is clicked
    $('body').on('click', '.submit_btn#edit_stu', function(event) {
        event.preventDefault()
        id = $(this).parent().attr('id')
        stu_id = (id.split('edit'))[0]
        const stu_edit_form  = document.getElementById(stu_id + 'edit');
        sch_id = $('.selected_school').attr('id')
        let post_dict = {}
        post_dict['password'] = (stu_edit_form.elements['password']).value;
        post_dict['name'] = (stu_edit_form.elements['name']).value;
        post_dict['age'] = (stu_edit_form.elements['age']).value;
        post_dict['sex'] = (stu_edit_form.elements['sex']).value;
        post_dict['parent_phone'] = (stu_edit_form.elements['parent_phone']).value;

        // API call to update student
        $.ajax({
            type: 'PUT',
            url: '/api/v1/schools/' + sch_id + '/students/' + stu_id,
            data: JSON.stringify(post_dict),
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {
                if (data['code'] === 'Updated') {
                    // Operation success
                    alert("Student has been updated successfully")
                    stu_edit_form.reset();
                    $('.stu_edit_form').toggleClass('hide_cards show_cards');
                    setTimeout("location.reload(true);",1500);
                }
                else if (data['code'] === 'Wrong password') {
                    // If provided password is wrong
                    $('.message').html('<p>Wrong password!</p>');
                    $('#stu_del_pop').css('background-color', 'lightcoral')
                    $('#stu_del_pop').toggleClass('hide_cards show_cards');
                }
            }
        });
    });


    // When 'make payment' under student is clicked
    $('body').on('click', '.add_pay > p', function() {
        id = $(this).siblings('form').attr('id')
        $('.signup_input_group#' + id).toggleClass('hide_cards show_cards')
    })

    // When 'make payment' is clicked to submit payment form
    $('body').on('click', '.submit_btn#add_pay', function(event) {
        event.preventDefault()
        id = $(this).parent().attr('id')
        stu_id = (id.split('pay'))[0]
        const stu_pay_form  = document.getElementById(stu_id + 'pay');
        sch_id = $('.selected_school').attr('id')
        let post_dict = {}
        post_dict['payer_name'] = (stu_pay_form.elements['payer_name']).value;
        post_dict['amount'] = (stu_pay_form.elements['amount']).value;
        post_dict['purpose'] = (stu_pay_form.elements['purpose']).value;
        post_dict['student_id'] = stu_id;
        post_dict['password'] = (stu_pay_form.elements['password']).value;

        // API call to create a payment
        $.ajax({
            type: 'POST',
            url: '/api/v1/schools/' + sch_id + '/students/' + stu_id + '/fees',
            data: JSON.stringify(post_dict),
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {
                if (data['code'] === 'Success') {
                    // Operation success
                    alert("Payment successful")
                    stu_pay_form.reset();
                    $('.stu_pay_form').toggleClass('hide_cards show_cards');
                    setTimeout("location.reload(true);",1500);
                }
                else if (data['code'] === 'Wrong password') {
                    // If a provided password is wrong
                    $('.message').html('<p>Wrong password!</p>');
                    $('#stu_del_pop').css('background-color', 'lightcoral')
                    $('#stu_del_pop').toggleClass('hide_cards show_cards');
                }
                else if (data['code'] === 'Invalid credentials') {
                    // If Credentials are invalid
                    $('.message').html('<p>Invalid data!</p>');
                    $('#stu_del_pop').css('background-color', 'lightcoral')
                    $('#stu_del_pop').toggleClass('hide_cards show_cards');
                }
            }
        });
    });


    // Action to take when 'delete' under student is clicked
    $('body').on('click', '.del_obj > p', function() {
        id = $(this).siblings('form').attr('id')
        $('.signup_input_group#' + id).toggleClass('hide_cards show_cards')
    })

    // Action to be taken when 'delete student' button is clicked
    $('body').on('click', '.submit_btn#del_stu', function(event) {
        event.preventDefault()
        id = $(this).parent().attr('id')
        stu_id = (id.split('delete'))[0]
        const stu_del_form  = document.getElementById(stu_id + 'delete');
        sch_id = $('.selected_school').attr('id')
        let post_dict = {}
        post_dict['password'] = (stu_del_form.elements['password']).value;

        // API call to delete student
        $.ajax({
            type: 'DELETE',
            url: '/api/v1/schools/' + sch_id + '/students/' + stu_id,
            data: JSON.stringify(post_dict),
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {
                if (data['code'] === 'Deleted') {
                    // Operation success
                    alert("Student has been deleted successfully")
                    stu_del_form.reset();
                    $('.stu_del_form').toggleClass('hide_cards show_cards');
                    setTimeout("location.reload(true);",1500);
                }
                else if (data['code'] === 'Wrong password') {
                    // If provided password is wrong
                    $('.message').html('<p>Wrong password!</p>');
                    $('#stu_del_pop').css('background-color', 'lightcoral')
                    $('#stu_del_pop').toggleClass('hide_cards show_cards');
                }
            }
        });
    });


    // When 'students' text is clicked on
    $('.lower_text > h5').on('click', function(event) {
        $('.students').toggleClass('hide_cards show_cards');
        $('#register_student').toggleClass('hide_cards show_cards');
    });


    // When a classroom is selected from the dropdown to register student
    $('body').on('click', '#stu_drop > div > p', function(event) {
        let new_text = $(this).text();
        let id = $(this).parent().parent().siblings().attr('id');
        cls_id = $(this).attr('id');
        $('#' + id + ' > div').html('<h4 class=selected_class id=' + cls_id + '>' + new_text + '</h4>');
    });
});
