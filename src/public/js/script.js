/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-this-alias */

const BASE_URL = 'http://localhost:4000/v1';

var itemData = [];

var itemModal = new bootstrap.Modal(document.getElementById('itemModal'), {
  keyboard: false,
});

const getItems = async () => {
  try {
    const holder = document.getElementById('itemTableBodyHolder');

    const response = await axios.get(`${BASE_URL}/items`);

    const items = response.data.data;

    itemData = items;

    holder.innerHTML = '';

    for (let item of items) {
      holder.innerHTML += `
        <tr>
            <td>${item.id}</td>
            <td>${item.sku}</td>
            <td>${item.name}</td>
            <td>${item.category}</td>
            <td>${item.inventory}</td>
            <td>${item.created_at}</td>
            <td>${item.updated_at}</td>
            <td><button type="button" class="btn btn-primary itemActionButton" actionType="EDIT" skuVal="${item.sku}">Edit</button></td>
            <td><button type="button" class="btn btn-danger itemActionButton" actionType="DELETE" skuVal="${item.sku}">Delete</button></td>
        </tr>
        `;
    }

    document.querySelectorAll('.itemActionButton').forEach((item) => {
      item.addEventListener('click', rootButtonClickHandler);
    });
  } catch (errors) {
    console.error(errors);
  }
};

async function rootButtonClickHandler(evt) {
  const clickedButton = evt.target;
  const actionType = clickedButton.getAttribute('actionType');
  if (actionType == 'DELETE') {
    const sku = clickedButton.getAttribute('skuVal');
    if (confirm(`Are you sure you want to delete item ${sku}?`)) {
      await deleteItem(sku);
    }
  } else if (actionType == 'EDIT') {
    const sku = clickedButton.getAttribute('skuVal');
    await editItem(sku);
  }
}

const deleteItem = async (sku) => {
  await axios.delete(`${BASE_URL}/items/${sku}`);
  await getItems();
};

const editItem = async (sku) => {
  //alert("Edit item " + JSON.stringify(getItemFromSku(sku)))
  itemModal.show();
};

function getItemFromSku(sku) {
  for (let item of itemData) {
    if (item.sku == sku) {
      return item;
    }
  }
  return {};
}

getItems();
