$(document).ready(function() {
    user = $('body > p').attr('id')
    var all_classes = $('.students > div');
    classes = Object.assign([], all_classes)
    first_sch = $('.selected_school').attr('id')
    let current_classes;

    /* Load all the percentages once the page loads */
    $.ajax({
        type: 'GET',
        url: '/api/v1/schools/' + first_sch + '/classrooms',
        dataType: 'json',
        success: function (data) {
            current_classes = data 
        }
    });
    $.ajax({
        type: 'GET',
        url: '/api/v1/schools/' + first_sch + '/students',
        dataType: 'json',
        success: function (data) {
            for (const [key, stu] of Object.entries(data)) {
                for (const [key, stu_cls] of Object.entries(current_classes)) {
                    if (stu.cls_id === stu_cls.id) {
                        stu_percent = parseInt(stu.fees_paid / stu_cls.fees_expected * 100)
                        $('.student#' + stu.id + ' > .stu_info > .stu_text > h1').html('')
                        $('.student#' + stu.id + ' > .stu_info > .stu_text > h1').html(stu_percent + '%')
                        if (stu_percent > 100) {
                            stu_percent = 100;
                        }
                        $('.student#' + stu.id + ' > .stu_info > .stu_percent_bar > .stu_bar').css('width', stu_percent + '%')
                    }
                }
            }
        }
    });
    $.ajax({
        type: 'GET',
        url: '/api/v1/users/' + user + '/schools/' + first_sch,
        dataType: 'json',
        success: function (data) {
            for (let key in data) {
                sch_percent = (data[key]).sch_percent
		$('.cls_text > h1').html(sch_percent + '%')
		if (parseInt(sch_percent) > 100) {
		    sch_percent = '100'
		}
		$('.cls_bar').css('width', sch_percent + '%')
            }
        }
    });


    /* When options in each view is clicked (delete/edit buttons) */
    $('body').on('click', '.options', function(event) {
        id = $(this).attr('id')
        console.log(id)
        $('.options#' + id).siblings('.del_edit').toggleClass('hide_cards show_cards');
    });


    /* Cancel the error messages */
    $('.cancel_popup').on('click', function() {
        $('.pop_up').toggleClass('hide_cards show_cards');
    });
});
