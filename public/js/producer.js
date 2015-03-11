var updateProduct = function(id){
    if(id == 'new'){
        var tr = $('#new');
        var p = {};
        p.producer = $('#producer_id').val();
        p.name = tr.find("input[id='name']").val();
        p.unit = tr.find("input[id='unit']").val();
        p.price = tr.find("input[id='price']").val();
        $.ajax({
            url : "/api/product",
            type: "POST",
            data : p,
            success: function(data, status, jqXHR){
                tr.find("a[id='updateLink']").attr("href","javascript:updateProduct('"+data+"')");
                tr.children().last('<td>').append('<a class="btn btn-sm btn-primary" href="/product/remove/'+data+'"><span class="glyphicon glyphicon-remove-circle"></span></a>');
                tr.attr("id",data);
            },complete: function(jqXHR, status){
                //alert('complete');
            },error: function(jqXHR, status, errorThrown){
                //err
                alert(status);
            }
        });
    }else{
        var tr = $('#'+id);
        var p = {};
        p.producer = $('#producer_id').val();
        p.name = tr.find("input[id='name']").val();
        p.unit = tr.find("input[id='unit']").val();
        p.price = tr.find("input[id='price']").val();
        $.ajax({
            url : "/api/product/"+id,
            type: "POST",
            data : p,
            success: function(data, status, jqXHR){
            },complete: function(jqXHR, status){
                //alert('complete');
            },error: function(jqXHR, status, errorThrown){
                //err
                alert(status);
            }
        });
    }
};


var addProduct = function(){
    $('#products').find('tbody')
    .append($('<tr id="new">')
            .append($('<td>')
                    .append('<input type="text" class="form-control" name="name" id="name" value="nom" required></input>'))
                    .append($('<td>')
                            .append('<input type="text" class="form-control" name="unit" id="unit" value="unite" required></input>'))
                            .append($('<td>')
                                    .append('<input type="text" class="form-control" name="price" id="price" value="prix" required></input>'))
                                    .append($('<td>')
                                            .append('<a id="updateLink" class="btn btn-sm btn-primary" href="javascript:updateProduct(\'new\')"><span class="glyphicon glyphicon-edit"></span></a>')));
}
