var updateProduct = function(id){
    if(id == 'new'){
        alert('new');
    }else{
        alert('update');
    }
    /*    $('#product').find(":selected").remove();
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
    });*/
};


var addProduct = function(){
    alert('add');
    $('#products').find('tbody')
    .append($('<tr id="new">')
            .append($('<td>')
                    .append('<input type="text" class="form-control" name="name" id="name" value="nom" required></input>'))
                    .append($('<td>')
                            .append('<input type="text" class="form-control" name="unit" id="unit" value="unite" required></input>'))
                            .append($('<td>')
                                    .append('<input type="text" class="form-control" name="price" id="price" value="prix" required></input>'))
                                    .append($('<td>')
                                            .append('<a class="btn btn-sm btn-primary" href="javascript:updateProduct(\'new\')"><span class="glyphicon glyphicon-edit"></span></a>')));
}
