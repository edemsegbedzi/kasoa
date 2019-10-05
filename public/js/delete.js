const deleteProduct = (button) => {
    const csrf = button.parentNode.querySelector('[name=_csrf]').value;
    const productId = button.parentNode.querySelector('[name=productId]').value;
    const articleDom = button.parentNode.parentNode;
    fetch("/admin/product/"+productId,{
        method: "DELETE",
        headers: {
            'csrf-token': csrf
          }
    }).then(response => response.json())
    .then(data => {
        articleDom.parentNode.removeChild(articleDom)
    })
}