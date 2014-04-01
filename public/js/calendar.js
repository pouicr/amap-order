var addLine = function (){
    var id = $('#product').find(":selected").val();
    $.ajax({
        url : "/calendar/getLine",
        type: "POST",
        data : {id:id},
        success: function(data, status, jqXHR){
            //add line to the table
            $('#cal_table')
            .find('tbody')
            .append($('<tr>')
                .append($('<td>')
                    .text(data.name))
                .append($('<td>')
                    .text(data.unit))
                .append($('<td>')
                    .text(data.price))
                .append($('<td>')
                    .append('<input type="text" class="span2" value="02-16-2014" id="val_'+id+'">')));
        },complete: function(jqXHR, status){
            $("#val_"+id).datepicker();
        },error: function(jqXHR, status, errorThrown){
            //err
            alert(status);
        }
    });
};
