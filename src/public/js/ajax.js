$(function(){
    $('table').on('click','.vota',function(){
        let row = $(this).closest('tr');
        let id = row.find('.id').text();
        var myModal = new bootstrap.Modal(document.getElementById('exampleModal'));
        myModal.show();
        $('#exampleModal').on('click','.aceptar',function(){
            myModal.hide();
            $.ajax({
                url: "/casillas/votar/"+id,
                method: "PUT",
                success: function(response){
                    console.log(response);
                    if (response = 'Actualizado'){
                        $( ".inner" ).addClass( "show" );
                        row.remove();
                    }else{
                        $( ".inner2" ).addClass( "show" );
                    }
                }
            })
        });
    });

    $('table').on('click','.elimina',function(){
        let row = $(this).closest('tr');
        let id = row.find('.id').text();
        var myModal = new bootstrap.Modal(document.getElementById('exampleModal'));
        myModal.show();
        $('#exampleModal').on('click','.aceptar',function(){
            myModal.hide();
            $.ajax({
                url: "/delegados/delete/"+id,
                method: "PUT",
                success: function(response){
                    console.log(response);
                    if (response = 'Eliminado'){
                        $( ".inner" ).addClass( "show" );
                        row.remove();
                    }else{
                        $( ".inner2" ).addClass( "show" );
                    }
                }
            })
        });
    });

    $('table').on('click','.elimina_promovido',function(){
        let row = $(this).closest('tr');
        let id = row.find('.id').text();
        var myModal = new bootstrap.Modal(document.getElementById('exampleModalB'));
        myModal.show();
        $('#exampleModalB').on('click','.aceptar',function(){
            myModal.hide();
            $.ajax({
                url: "/delegados/promovidos/delete/"+id,
                method: "PUT",
                success: function(response){
                    console.log(response);
                    if (response = 'Eliminado'){
                        $( ".inner" ).addClass( "show" );;
                        row.remove();
                    }else{
                        $( ".inner2" ).addClass( "show" );
                    }
                }
            })
        });
    });

    $('table').on('click','.eliminar_lista',function(){
        let row = $(this).closest('tr');
        let id = row.find('.id').text();
        var myModal = new bootstrap.Modal(document.getElementById('exampleModal5'));
        myModal.show();
        $('#exampleModal5').on('click','.aceptar',function(){
            myModal.hide();
            $.ajax({
                url: "/mpios/seccion/casillas/lista/eliminar/"+id,
                method: "PUT",
                success: function(response){
                    console.log(response);
                    if (response = 'Eliminado'){
                        $( ".inner" ).addClass( "show" );;
                        row.remove();
                    }else{
                        $( ".inner2" ).addClass( "show" );
                    }
                }
            })
        });
    });

});