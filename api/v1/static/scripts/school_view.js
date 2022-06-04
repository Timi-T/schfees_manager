// Take action when the document loads
$(document).ready(function () {
    // Retrieving the user id from the html document
    user = $('body > p').attr('id')

    // Retriveing all classrooms from html document
    var all_classes = $('.students > div');
    classes = Object.assign([], all_classes)

    // Retriving id of the school that loads up first
    first_sch = $('.selected_school').attr('id')


    /* Action to be taken when a school is selected from 
    the dropdowm */
    $('#sch_drop > div > p').on('click', function(event) {
        // Change the name for the current school
        let new_text = $(this).text()
        let id = $(this).parent().parent().siblings().attr('id');
        sch_id = $(this).attr('id');
        $('#' + id + ' > div').html('<h4 class=selected_school id=' + sch_id + '>' + new_text + '</h4>');

        // API call to get information about the selected school
        $.ajax({
            type: 'GET',
            url: '/api/v1/users/' + user + '/schools/' + sch_id,
            dataType: 'json',
            success: function (data_obj) {
                for (let k in data_obj) {
                    // Unpacking the data
                    data = data_obj[k]
                }

                // Change the content of the information display
                sch_text = "<h5>School name: <span>" + data.name + "</span></h5>";
                sch_text += "<h5>School address: <span>" + data.address + "<span></span></h5>";
                sch_text += "<h5 class=current_sch id=" + data.id + ">School ID: <span>" + data.id + "</span></h5>";
                sch_text += "<h5>Level: <span>" + data.level + "</span></h5>";
                sch_text += "<h5>Fees paid: <span>NGN " + data.fees_paid + "</span></h5>";
                sch_text += "<h5>No. of classes: <span>" + data.no_of_classes + "</span></h5>";
                sch_text += "<h5>No. of students: <span>" + data.no_of_students + "</span></h5>";
                sch_text += "<h1>" + data.sch_percent + "%</h1>";
                $('.cls_bar').css('width', data.sch_percent + '%')
                $('.cls_text').html(sch_text);
                $('body > header > .cls_name').html('')
                $('body > header > .cls_name').html(data.name)
                $('body > .cls_addr > p').html(data.address)

                // Change the content of the delete and edit options
                $('.del_edit').html('')
                new_txt = ''
                new_txt += '<div class="del_sch">'
                new_txt += '<p>Delete</p>'
                new_txt += '<form class="signup_input_group hide_cards" id=' + sch_id + 'delete>'
                new_txt += '<input type="password" class="input_fields" name="password" id="password" placeholder="Admin Password" required>'
                new_txt += '<p class="warn">CAREFUL HERE, YOU CANNOT UNDO THIS!</p>'
                new_txt += '<button class="submit_btn" id="del_sch" >Delete school</button><br>'
                new_txt += '</form></div>'
                new_txt += '<div class="edit_sch">'
                new_txt += '<p>Edit</p>'
                sch_name = data.name.replaceAll(' ', '_')
                sch_addr = data.address.replaceAll(' ', '_')
                new_txt +=  '<form class="signup_input_group hide_cards" id=' + data.id + 'edit>'
                new_txt += '<input type="text" class="input_fields" name="name" id="name" required minlength="5" value=' + sch_name + '>'
                new_txt += '<input type="text" class="input_fields" name="address" id="address" required minlength="15" value=' + sch_addr + '>'
                new_txt += '<input type="text" class="input_fields" name="level" id="level" required value=' + data.level + '>'
                new_txt += '<input type="password" class="input_fields" name="password" id="password" placeholder="Admin password" required>'
                new_txt += '<button class="submit_btn" id="edit_sch" >Edit school</button><br>'
                new_txt += '</form></div>'
                $('.del_edit').html(new_txt)
            }
        });

        // API call to get the classrooms in the selected school
        $.ajax({
            type: 'GET',
            url: '/api/v1/schools/' + sch_id + '/classrooms',
            dataType: 'json',
            success: function (data) {
                $('#cls_drop').html('');
                $('#stu_drop').html('');
                txt_stu = '';
                txt_cls = '';
                sch_id = $('.current_sch').attr('id')
                for (let key in data) {
                    if (data['code']) {
                        // If data returns an error
                        break;
                    }
                    link = '/api/v1/schools/' + sch_id + '/classrooms/' + (data[key]).id,
                    txt_stu += '<div><p class=cl_item id=' + (data[key]).id + '>' + (data[key]).name + '</p></div>'
                    txt_cls += '<div><p class=cl_item id=' + (data[key]).id + '>' + (data[key]).name + '</p></div>'
                }
                $('#cls_drop').html(txt_cls);
                $('#stu_drop').html(txt_stu);
                if (data['code']) {
                    $('#cls_sel > div >h4').html("<p>...</p>");
                    $('#stu_sel > div >h4').html("<p>...</p>");
                }
                else {
                    $('#cls_sel > div >h4').html("<p>Select class</p>");
                    $('#stu_sel > div >h4').html("<p>Select class</p>");
                }
            }
        });

        // API call to get students in the selected school
        $.ajax({
            type: 'GET',
            url: '/api/v1/schools/' + sch_id + '/students',
            dataType: 'json',
            success: function (data) {
                $('.students').html('')
                if (data['code']) {
                    // If there are no students
                    return
                }
                txt = ''
                // Customize entire page to display selected school
                for (const [key, stu] of Object.entries(data)) {
                    txt += '<div class="student_class" id=' + stu.cls_id
                    txt += '><div class=hide_cards><i class="fas fa-caret-down close_view hide_cards"></i></div>'
                    txt += '<h4 class="student shrink_view" id=' + stu.id + '><p>' + stu.name
                    txt += '</p><div class="stu_info hide_cards">'
                    txt += '<div class="stu_text">'
                    txt += '<h5>Student name: <span>' + stu.name + '</span></h5>'
                    txt += '<h5>Age: <span>' + stu.age + '<span></span></h5>'
                    txt += '<h5>Sex: <span>' + stu.sex + '<span></span></h5>'
                    txt += '<h5>Student ID: <span>' + stu.id + '</span></h5>'
                    txt += '<h5>Class: <span>' + stu.cls + '</span></h5>'
                    txt += '<h5>Fees paid: <span>NGN ' + stu.fees_paid +  '</span></h5>'
                    fees_percent = stu.fees_percent
                    txt += '<h1>' + fees_percent + '%</h1>'
                    txt += '</div>'
                    txt += '<div class="stu_percent_bar">'
                    if (fees_percent > 100) {
                        fees_percent = 100;
                    }
                    txt += '<div style="width:' + fees_percent + '%" class="stu_bar" id=' + stu.id + 'percent></div>'
                    txt += '</div>'
                    txt += '<div class="options" id=' + (stu.name).replace(' ', '_') + '>'
                    txt += '<h5><i class="fas fa-bars"></i></h5>'
                    txt += '</div>'
                    txt += '<div class="del_edit hide_cards">'
                    txt += '<div class="del_obj">'
                    txt += '<p>Delete</p>'
                    txt += '<form class="signup_input_group hide_cards" id=' + stu.id + 'delete>'
                    txt += '<input type="password" class="input_fields" name="password" id="password" placeholder="Admin Password" required>'
                    txt += '<p class="warn">CAREFUL HERE, YOU CANNOT UNDO THIS!</p>'
                    txt += '<button class="submit_btn" id="del_stu" >Delete student</button><br>'
                    txt += '</form></div>'
                    txt += '<div class="edit_obj">'
                    txt += '<p>Edit</p>'
                    txt += '<form class="signup_input_group hide_cards" id=' + stu.id + 'edit>'
                    display_name = (stu.name).replaceAll(' ', '_')
                    txt += '<input type="text" class="input_fields" name="name" id="name" required minlength="5" value=' + display_name + '>'
                    txt += '<input type="text" class="input_fields" name="age" id="age" required value=' + stu.age + '>'
                    txt += '<input type="text" class="input_fields" name="sex" id="sex" required value=' + stu.sex + '>'
                    txt += '<input type="text" class="input_fields" name="parent_phone" id="parent_phone" required minlength="11" value=' + stu.parent_phone + '>'
                    txt += '<input type="password" class="input_fields" name="password" id="password" placeholder="Admin password" required>'
                    txt += '<button class="submit_btn" id="edit_stu" >Edit student</button><br>'
                    txt += '</form></div>'
                    txt += '<div class="add_pay">'
                    txt += '<p>Make payment</p>'
                    txt += '<form class="signup_input_group hide_cards" id=' + stu.id + 'pay>'
                    txt += '<input type="text" class="input_fields" name="payer_name" id="payer_name" placeholder="Payer name" required minlength="5">'
                    txt += '<input type="number" class="input_fields" name="amount" id="amount" placeholder="Amount" required>'
                    txt += '<input type="text" class="input_fields" name="purpose" id="purpose" placeholder="Purpose" required>'
                    txt += '<input type="password" class="input_fields" name="password" id="password" placeholder="Admin password" required>'
                    txt += '<button class="submit_btn" id="add_pay" >Make payment</button><br>'
                    txt += '</form></h4></div></div>'
                }
                $('.students').html(txt);
            }
        })
        classes = Object.assign([], all_classes)
    });


    // Action to be taken when register school button is clicked
    $('#register_school').on('click', function(event) {
        // Show school registration form
        $('.sch_reg_form').toggleClass('hide_cards show_cards');
    });

    // Action to be take when a new school is registered
    const sch_reg_form  = document.getElementById('new_school');
    sch_reg_form.addEventListener('submit', (event) => {
        event.preventDefault()
        const name = (sch_reg_form.elements['name']).value;
        const address = (sch_reg_form.elements['address']).value;
        const level = (sch_reg_form.elements['level']).value;
        const pwd = (sch_reg_form.elements['password']).value;
        const user_id = (sch_reg_form.elements['user_id']).value;
        let post_dict = {}
        post_dict['name'] = name
        post_dict['address'] = address
        post_dict['level'] = level
        post_dict['password'] = pwd
        // API call to get schools associated with current user
        $.ajax({
            type: 'POST',
            url: '/api/v1/users/' + user_id + '/schools',
            data: JSON.stringify(post_dict),
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {
                if (data['code'] === 'School created') {
                    // Operation success
                    alert("School created!")
                    sch_reg_form.reset();
                    $('.sch_reg_form').toggleClass('hide_cards show_cards');
                    setTimeout("location.reload(true);",1500);
                }
                else if (data['code'] === 'School exists') {
                    // If school exists
                    $('.message').html('<p>School with that name exists already!</p>');
                    $('#sch_form_pop').css('background-color', 'lightcoral')
                    $('#sch_form_pop').toggleClass('hide_cards show_cards');
                }
                else if (data['code'] === 'Wrong password') {
                    // If provided password is wrong
                    $('.message').html('<p>Wrong password!</p>');
                    $('#sch_form_pop').css('background-color', 'lightcoral')
                    $('#sch_form_pop').toggleClass('hide_cards show_cards');
                }
                else {
                    // Other errors
                    $('.message').html('<p>Error</p>');
                    $('#sch_form_pop').css('background-color', 'lightcoral')
                    $('#sch_form_pop').toggleClass('hide_cards show_cards');
                }
            }
        });
    });


    /* When delete button under school or class is clicked */
    $('body').on('click', '.del_sch > p', function() {
        id = $(this).siblings('form').attr('id')
        // Show the delete form
        $('.signup_input_group#' + id).toggleClass('hide_cards show_cards')
    })

    /* Action to be taken when delete school button is clicked */
    $('body').on('click', '.submit_btn#del_sch', function(event) {
        event.preventDefault()
        id = $(this).parent().attr('id')
        sch_id = (id.split('delete'))[0]
        const sch_del_form  = document.getElementById(sch_id + 'delete');
        let post_dict = {}
        post_dict['password'] = (sch_del_form.elements['password']).value;

        // API call to delete current school
        $.ajax({
            type: 'DELETE',
            url: '/api/v1/users/' + user + '/schools/' + sch_id,
            data: JSON.stringify(post_dict),
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {
                if (data['code'] === 'Deleted') {
                    // Operation success
                    alert("School has been deleted successfully")
                    sch_del_form.reset();
                    $('.sch_del_form').toggleClass('hide_cards show_cards');
                    setTimeout("location.reload(true);",1500);
                }
                else if (data['code'] === 'Wrong password') {
                    // If provided password is wrong
                    $('.message').html('<p>Wrong password!</p>');
                    $('#sch_del_pop').css('background-color', 'lightcoral');
                    $('#sch_del_pop').toggleClass('hide_cards show_cards');
                }
            }
        });
    });


    /* When edit under school or class is clicked */
    $('body').on('click', '.edit_sch > p', function() {
        id = $(this).siblings('form').attr('id')
        // Show school edit form
        $('.signup_input_group#' + id).toggleClass('hide_cards show_cards')
    })

    // Action to take when edit school button is clicked
    $('body').on('click', '.submit_btn#edit_sch', function(event) {
        event.preventDefault()
        id = $(this).parent().attr('id')
        sch_id = (id.split('edit'))[0]
        const sch_edit_form  = document.getElementById(sch_id + 'edit');
        let post_dict = {}
        post_dict['password'] = (sch_edit_form.elements['password']).value;
        post_dict['name'] = (sch_edit_form.elements['name']).value
        post_dict['address'] = (sch_edit_form.elements['address']).value;
        post_dict['level'] = (sch_edit_form.elements['level']).value;

        // API call to edit the selected school
        $.ajax({
            type: 'PUT',
            url: '/api/v1/users/' + user + '/schools/' + sch_id,
            data: JSON.stringify(post_dict),
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {
                if (data['code'] === 'Updated') {
                    // Operation success
                    alert("School has been updated successfully")
                    sch_edit_form.reset();
                    $('.sch_edit_form').toggleClass('hide_cards show_cards');
                    setTimeout("location.reload(true);",1500);
                }
                else if (data['code'] === 'Wrong password') {
                    // If provide password is wrong
                    $('.message').html('<p>Wrong password!</p>');
                    $('#sch_del_pop').css('background-color', 'lightcoral')
                    $('#sch_del_pop').toggleClass('hide_cards show_cards');
                }
            }
        });
    });
});
