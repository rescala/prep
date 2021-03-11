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
                        $( ".inner" ).append( "<div class='alert alert-success alert-dismissible fade show' role='alert'>¡Voto Registrado!<button type='button' class='btn-close' data-bs-dismiss='alert' aria-label='Close'></button></div>" );
                        row.remove();
                    }else{
                        $( ".inner" ).append( "<div class='alert alert-danger alert-dismissible fade show' role='alert'>Algo salió mal. Intenta nuevamente.<button type='button' class='btn-close' data-bs-dismiss='alert' aria-label='Close'></button></div>" );
                    }
                }
            })
        });
    });

});