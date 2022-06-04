// Take action when the document loads
$(document).ready(function () {
    // Retrieving the user id from the html document
    user = $('body > p').attr('id')

    // Retriveing all classrooms from html document
    var all_classes = $('.students > div');
    classes = Object.assign([], all_classes)

    // Retriving id of the school that loads up first
    first_sch = $('.selected_school').attr('id')


    /* Action to be taken When a classroom is selected 
    from the classrooms dropdown */
    $('body').on('click', '#cls_drop > div > p', function(event) {
        cls_id = event.target.id
        sch_id = $('.selected_school').attr('id')
        // API call to get a classroom's information
        $.ajax({
            type: 'GET',
            url: '/api/v1/schools/' + sch_id + '/classrooms/' + cls_id,
            dataType: 'json',
            success: function (data) {
                for (let key in data) {
                    // Unpacking the data
                    obj = data[key]
                }
                /* Changing the content of the information display section
                to that of the selected class */
                $('.cls_text').html('');
                new_text = ''
                new_text += '<h5>Class name: <span>' + obj.name + '</span><h5>'
                new_text += '<h5>Class Teacher: <span>' + obj.class_teacher + '</span><h5>'
                new_text += '<h5>Class ID: <span>' + obj.id + '</span><h5>'
                new_text += '<h5>Fees Paid: <span>' + obj.fees_paid + '</span><h5>'
                new_text += '<h5>No. of students: <span>' + obj.no_of_students + '</span><h5>'
                new_text += '<h1>' + obj.fees_percent + '%</h1>'
                $('.cls_bar').css('width', obj.fees_percent + '%')
                $('.cls_text').html(new_text);

                /* Changing the content of the delete and edit 
                options to that of the selected class */
                $('.del_edit').html('')
                new_txt = ''
                new_txt += '<div class="del_sch">'
                new_txt += '<p>Delete</p>'
                new_txt += '<form class="signup_input_group hide_cards" id=' + cls_id + 'delete>'
                new_txt += '<input type="password" class="input_fields" name="password" id="password" placeholder="Admin Password" required>'
                new_txt += '<p class="warn">CAREFUL HERE, YOU CANNOT UNDO THIS!</p>'
                new_txt += '<button class="submit_btn" id="del_cls" >Delete class</button><br>'
                new_txt += '</form></div>'
                new_txt += '<div class="edit_sch">'
                new_txt += '<p>Edit</p>'
                cls_name = obj.name.replaceAll(' ', '_')
                cls_teacher = obj.class_teacher.replaceAll(' ', '_')
                new_txt +=  '<form class="signup_input_group hide_cards" id=' + obj.id + 'edit>'
                new_txt += '<input type="text" class="input_fields" name="name" id="name" required minlength="5" value=' + cls_name + '>'
                new_txt += '<input type="text" class="input_fields" name="class_teacher" id="class_teacher" required value=' + cls_teacher + '>'
                new_txt += '<input type="password" class="input_fields" name="password" id="password" placeholder="Admin password" required>'
                new_txt += '<button class="submit_btn" id="edit_cls" >Edit class</button><br>'
                new_txt += '</form></div>'
                $('.del_edit').html(new_txt)
            }
        });
        // Get the classroom name of the selected classroom
        let new_text = $(this).text()
        // Get the id of the dropdown
        let id = $(this).parent().parent().siblings().attr('id');
        cls_id = $(this).attr('id');
        // Updating the dropdown information
        $('#' + id + ' > div').html('<h4 class=selected_class id=' + cls_id + '>' + new_text + '</h4>');
    });


    /* Action to take when a student is to be registered
    ( when register class is clicked) */
    $('#register_class').on('click', function(event) {
        $('.class_reg_form').toggleClass('hide_cards show_cards');
    });

    // Action to take when the class form is submitted
    const cls_reg_form  = document.getElementById('new_class');
    cls_reg_form.addEventListener('submit', (event) => {
        event.preventDefault()
        // Extracting the form information
        const name = (cls_reg_form.elements['name']).value;
        const class_teacher = (cls_reg_form.elements['class_teacher']).value;
        const fees_expected = (cls_reg_form.elements['fees_expected']).value;
        const pwd = (cls_reg_form.elements['password']).value;
        const sch_id = $('.current_sch').attr('id')
        let post_dict = {}
        post_dict['name'] = name
        post_dict['class_teacher'] = class_teacher
        post_dict['fees_expected'] = fees_expected
        post_dict['password'] = pwd
        post_dict['sch_id'] = sch_id

        // API call to create a new classroom
        $.ajax({
            type: 'POST',
            url: '/api/v1/schools/' + sch_id + '/classrooms',
            data: JSON.stringify(post_dict),
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {
                // Operation success
                if (data['code'] === 'Created') {
                    alert("Class added!")
                    cls_reg_form.reset()
                    $('.class_reg_form').toggleClass('hide_cards show_cards')
                    setTimeout("location.reload(true);", 1500);
                }
                else if (data['code'] === 'Class exists') {
                    // If class exists
                    $('.message').html('<p>Class with that name exists already!</p>');
                    $('#cls_form_pop').css('background-color', 'lightcoral')
                    $('#cls_form_pop').toggleClass('hide_cards show_cards');
                }
                else if (data['code'] === 'Wrong password') {
                    // If provided password is wrong
                    $('.message').html('<p>Wrong password!</p>');
                    $('#cls_form_pop').css('background-color', 'lightcoral')
                    $('#cls_form_pop').toggleClass('hide_cards show_cards');
                }
                else {
                    $('.message').html('<p>Error</p>');
                    $('#cls_form_pop').css('background-color', 'lightcoral')
                    $('#cls_form_pop').toggleClass('hide_cards show_cards');
                }
            }
        });
    });


    // Action to be taken when a classroom is to be deleted
    $('body').on('click', '.submit_btn#del_cls', function(event) {
        event.preventDefault()
        id = $(this).parent().attr('id')
        cls_id = (id.split('delete'))[0]
        sch_id = $('.selected_school').attr('id')
        const cls_del_form  = document.getElementById(cls_id + 'delete');
        let post_dict = {}
        post_dict['password'] = (cls_del_form.elements['password']).value;
        // API call to delete a classroom
        $.ajax({
            type: 'DELETE',
            url: '/api/v1/schools/' + sch_id + '/classrooms/' + cls_id,
            data: JSON.stringify(post_dict),
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {
                if (data['code'] === 'Deleted') {
                    // Operation success
                    alert("Class has been deleted successfully")
                    cls_del_form.reset();
                    $('.cls_del_form').toggleClass('hide_cards show_cards');
                    setTimeout("location.reload(true);",1500);
                }
                else if (data['code'] === 'Wrong password') {
                    // If provided password is wrong
                    $('.message').html('<p>Wrong password!</p>');
                    $('#cls_del_pop').css('background-color', 'lightcoral');
                    $('#cls_del_pop').toggleClass('hide_cards show_cards');
                }
            }
        });
    });


    // Action to be taken when a classroom is to be edited
    $('body').on('click', '.submit_btn#edit_cls', function(event) {
        event.preventDefault()
        id = $(this).parent().attr('id')
        cls_id = (id.split('edit'))[0]
        sch_id = $('.selected_school').attr('id')
        const cls_edit_form  = document.getElementById(cls_id + 'edit');
        let post_dict = {}
        post_dict['password'] = (cls_edit_form.elements['password']).value;
        post_dict['name'] = (cls_edit_form.elements['name']).value
        post_dict['class_teacher'] = (cls_edit_form.elements['class_teacher']).value;
        // API call to edit the classroom
        $.ajax({
            type: 'PUT',
            url: '/api/v1/schools/' + sch_id + '/classrooms/' + cls_id,
            data: JSON.stringify(post_dict),
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {
                if (data['code'] === 'Updated') {
                    // Operation success
                    alert("Classroom has been updated successfully")
                    cls_edit_form.reset();
                    $('.cls_edit_form').toggleClass('hide_cards show_cards');
                    setTimeout("location.reload(true);",1500);
                }
                else if (data['code'] === 'Wrong password') {
                    // If provided password is wrong
                    $('.message').html('<p>Wrong password!</p>');
                    $('#cls_del_pop').css('background-color', 'lightcoral')
                    $('#cls_del_pop').toggleClass('hide_cards show_cards');
                }
            }
        });
    });
});
