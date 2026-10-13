/*
 * Em produção, substitua API_URL pela URL pública da API na Vercel.
 * Exemplo: const API_URL = "https://sua-api.vercel.app";
 * Local: rode a API em http://localhost:3000
 */
const API_URL = "http://localhost:3000";

const formPanel = document.querySelector("#formPanel");
const form = document.querySelector("#clothingForm");
const grid = document.querySelector("#clothingGrid");
const counter = document.querySelector("#counter");
const notice = document.querySelector("#notice");
const loading = document.querySelector("#loading");
const emptyState = document.querySelector("#emptyState");
const saveButton = document.querySelector("#saveButton");

function showNotice(message, type = "success") {
  notice.textContent = message;
  notice.className = `notice ${type}`;
  window.setTimeout(() => notice.classList.add("hidden"), 4500);
}

function money(value) {
  return Number(value).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function validImageUrl(value) {
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol);
  } catch {
    return false;
  }
}

async function api(path = "", options = {}) {
  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: { "Content-Type": "application/json", ...(options.headers || {}) }
    });
  } catch {
    throw new Error("Não foi possível conectar à API. Verifique se o backend está rodando e se API_URL está correta.");
  }

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await response.json() : null;
  if (!response.ok) throw new Error(data?.erro || data?.message || `Erro HTTP ${response.status}`);
  return data;
}

function createCard(roupa) {
  const card = document.createElement("article");
  card.className = "clothing-card";

  const imageWrap = document.createElement("div");
  imageWrap.className = "card-image-wrap";
  if (validImageUrl(roupa.foto)) {
    const image = document.createElement("img");
    image.className = "card-image";
    image.src = roupa.foto;
    image.alt = `${roupa.marca} ${roupa.modelo}`;
    image.loading = "lazy";
    image.referrerPolicy = "no-referrer";
    image.onerror = () => {
      image.remove();
      const fallback = document.createElement("div");
      fallback.className = "card-image-fallback";
      fallback.textContent = "Imagem indisponível";
      imageWrap.append(fallback);
    };
    imageWrap.append(image);
  } else {
    const fallback = document.createElement("div");
    fallback.className = "card-image-fallback";
    fallback.textContent = "Fashion Catalog";
    imageWrap.append(fallback);
  }

  const content = document.createElement("div");
  content.className = "card-content";
  const brand = document.createElement("div");
  brand.className = "card-brand";
  brand.textContent = roupa.marca;
  const model = document.createElement("h3");
  model.className = "card-model";
  model.textContent = roupa.modelo;
  const bottom = document.createElement("div");
  bottom.className = "card-bottom";
  const price = document.createElement("span");
  price.className = "card-price";
  price.textContent = money(roupa.preco);
  const actions = document.createElement("div");
  actions.className = "card-actions";

  const edit = document.createElement("button");
  edit.className = "small-button";
  edit.type = "button";
  edit.textContent = "Editar";
  edit.addEventListener("click", () => editClothing(roupa));

  const remove = document.createElement("button");
  remove.className = "small-button delete";
  remove.type = "button";
  remove.textContent = "Excluir";
  remove.addEventListener("click", () => deleteClothing(roupa));

  actions.append(edit, remove);
  bottom.append(price, actions);
  content.append(brand, model, bottom);
  card.append(imageWrap, content);
  return card;
}

async function loadClothes() {
  loading.classList.remove("hidden");
  grid.replaceChildren();
  emptyState.classList.add("hidden");
  try {
    const clothes = await api("/roupas");
    counter.textContent = `${clothes.length} ${clothes.length === 1 ? "peça cadastrada" : "peças cadastradas"}`;
    if (!clothes.length) {
      emptyState.classList.remove("hidden");
    } else {
      const fragment = document.createDocumentFragment();
      clothes.forEach((roupa) => fragment.append(createCard(roupa)));
      grid.append(fragment);
    }
  } catch (error) {
    counter.textContent = "Não foi possível carregar o catálogo";
    showNotice(error.message, "error");
  } finally {
    loading.classList.add("hidden");
  }
}

function openForm(roupa = null) {
  form.reset();
  document.querySelector("#roupaId").value = roupa?._id || "";
  document.querySelector("#formTitle").textContent = roupa ? "Editar peça" : "Adicionar roupa";
  document.querySelector("#marca").value = roupa?.marca || "";
  document.querySelector("#modelo").value = roupa?.modelo || "";
  document.querySelector("#preco").value = roupa?.preco ?? "";
  document.querySelector("#foto").value = roupa?.foto || "";
  saveButton.textContent = roupa ? "Salvar alterações" : "Salvar peça";
  formPanel.classList.remove("hidden");
  formPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  document.querySelector("#marca").focus();
}

function editClothing(roupa) {
  openForm(roupa);
}

async function deleteClothing(roupa) {
  if (!window.confirm(`Deseja excluir "${roupa.modelo}" da marca ${roupa.marca}?`)) return;
  try {
    await api(`/roupas/${encodeURIComponent(roupa._id)}`, { method: "DELETE" });
    showNotice("Peça excluída com sucesso.");
    await loadClothes();
  } catch (error) {
    showNotice(error.message, "error");
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const id = document.querySelector("#roupaId").value;
  const dados = {
    marca: document.querySelector("#marca").value.trim(),
    modelo: document.querySelector("#modelo").value.trim(),
    preco: Number(document.querySelector("#preco").value),
    foto: document.querySelector("#foto").value.trim()
  };

  if (!dados.marca || !dados.modelo || !dados.foto || !Number.isFinite(dados.preco) || dados.preco <= 0) {
    showNotice("Preencha todos os campos corretamente. O preço deve ser maior que zero.", "error");
    return;
  }
  if (!validImageUrl(dados.foto)) {
    showNotice("Informe uma URL de foto válida (http ou https).", "error");
    return;
  }

  saveButton.disabled = true;
  saveButton.textContent = "Salvando...";
  try {
    await api(id ? `/roupas/${encodeURIComponent(id)}` : "/roupas", {
      method: id ? "PUT" : "POST",
      body: JSON.stringify(dados)
    });
    showNotice(id ? "Peça atualizada com sucesso." : "Peça cadastrada com sucesso.");
    formPanel.classList.add("hidden");
    form.reset();
    await loadClothes();
  } catch (error) {
    showNotice(error.message, "error");
  } finally {
    saveButton.disabled = false;
    saveButton.textContent = id ? "Salvar alterações" : "Salvar peça";
  }
});

document.querySelector("#newButton").addEventListener("click", () => openForm());
document.querySelector("#emptyAddButton").addEventListener("click", () => openForm());
document.querySelector("#closeForm").addEventListener("click", () => formPanel.classList.add("hidden"));
document.querySelector("#cancelButton").addEventListener("click", () => formPanel.classList.add("hidden"));

loadClothes();
