const socket = io();

document.getElementById("username-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const usernameInput = document.getElementById("username");
    const username = usernameInput.value;

    socket.emit("newUser", username);

    Swal.fire({
        icon: "success",
        title: "Bienvenido a la carga de productos",
        text: `Estas conectado como: ${username}`
    });

    document.getElementById("username-form").style.display = "none";
    document.getElementById("product-form").style.display = "block";
});

// Agregar un producto
document.getElementById("form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    try {
        const response = await fetch('/api/products', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            const responseBody = await response.json();  // Parse the JSON response
            if (responseBody.result === "success"){
                const newProduct = responseBody.payload; 
                socket.emit('addProduct', newProduct);
            Swal.fire({
                icon: "success",
                title: "Producto agregado",
                text: `El producto ${newProduct.title} ha sido agregado exitosamente`
            });
            document.getElementById('title').value = "";
            document.getElementById('description').value = "";
            document.getElementById('code').value = "";
            document.getElementById('price').value = "";
            document.getElementById('stock').value = "";
            document.getElementById('category').value = "";
        } else {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se pudo agregar el producto. Por favor, verifica los campos y vuelve a intentarlo."
            });
        }
    }}catch (error) {
        console.error("Error al agregar el producto:", error);
    }
});

// Eliminar un producto
document.getElementById("delete-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const deleteId = document.getElementById("delete-id").value;
    
    try {
        const response = await fetch(`/api/products/${deleteId}`, {
            method: "DELETE",
        });

        if (response.ok) {
            socket.emit('deleteProduct', deleteId);
            Swal.fire({
                icon: "success",
                title: "Producto eliminado",
                text: `El producto con ID ${deleteId} ha sido eliminado exitosamente`,
            });
            document.getElementById('delete-id').value = "";
        } else {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: `No se pudo eliminar el producto con ID ${deleteId}`,
            });
        }
    } catch (error) {
        console.error("Error al eliminar el producto:", error);
    }
});