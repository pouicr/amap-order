var addLine = function (){
    var id = $('#product').find(":selected").val();
    if(!id){
        return;
    }
    $('#product').find(":selected").remove();
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
                    .append('<input type="text" value="02-16-2014" name="val_'+id+'" id="val_'+id+'">')));
        },complete: function(jqXHR, status){
            $("#val_"+id).multiDatesPicker();
        },error: function(jqXHR, status, errorThrown){
            //err
            alert(status);
        }
    });
};

$().ready(function() {
    $(".cal").each(function() {    
            $(this).multiDatesPicker({
                //dateFormat: "dd/mm/yy",
                addDates : $(this).val().split(',')
            });
    });
//    $(".cal").multiDatesPicker();
});
