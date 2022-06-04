// Take action when the document loads
$(document).ready(function() {
    // Retrieving the user id from the html document
    user = $('body > p').attr('id')

    // Retriveing all classrooms from html document
    var all_classes = $('.students > div');
    classes = Object.assign([], all_classes)

    // Retriving id of the school that loads up first
    first_sch = $('.selected_school').attr('id')

    let current_classes;

    // API call to GET the current school classsrooms
    $.ajax({
        type: 'GET',
        url: '/api/v1/schools/' + first_sch + '/classrooms',
        dataType: 'json',
        success: function (data) {
            current_classes = data 
        }
    });

    // API call to GET current school students
    $.ajax({
        type: 'GET',
        url: '/api/v1/schools/' + first_sch + '/students',
        dataType: 'json',
        success: function (data) {
            // Iterate through students in the school
            for (const [key, stu] of Object.entries(data)) {
                /* Iterate through each class in the school
                to find the students classroom */
                for (const [key, stu_cls] of Object.entries(current_classes)) {
                    if (stu.cls_id === stu_cls.id) {
                        /* Calculate the students payment percentage
                        by comapring amount paid by student to amount 
                        expected in the students classroom */
                        stu_percent = parseInt(stu.fees_paid / stu_cls.fees_expected * 100)
                        $('.student#' + stu.id + ' > .stu_info > .stu_text > h1').html('')
                        $('.student#' + stu.id + ' > .stu_info > .stu_text > h1').html(stu_percent + '%')
                        if (stu_percent > 100) {
                            stu_percent = 100;
                        }
                        // Setting the CSS property to display the percentage
                        $('.student#' + stu.id + ' > .stu_info > .stu_percent_bar > .stu_bar').css('width', stu_percent + '%')
                    }
                }
            }
        }
    });

    // API call to GET the first school's information
    $.ajax({
        type: 'GET',
        url: '/api/v1/users/' + user + '/schools/' + first_sch,
        dataType: 'json',
        success: function (data) {
            // Get the payment percentage for the school
            for (let key in data) {
                sch_percent = (data[key]).sch_percent
        // Setting the percentage as text
		$('.cls_text > h1').html(sch_percent + '%')
		if (parseInt(sch_percent) > 100) {
		    sch_percent = '100'
		}
        // Setting the CSS property to display the percentage
		$('.cls_bar').css('width', sch_percent + '%')
            }
        }
    });


    /* When options in each view is clicked (delete/edit buttons) */
    $('body').on('click', '.options', function(event) {
        id = $(this).attr('id')
        $('.options#' + id).siblings('.del_edit').toggleClass('hide_cards show_cards');
    });


    /* Cancel the error messages */
    $('.cancel_popup').on('click', function() {
        $('.pop_up').toggleClass('hide_cards show_cards');
    });
});
