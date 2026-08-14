const out = document.getElementById('out');
const healthOut = document.getElementById('healthOut');
const kind = document.getElementById('kind');
const valueFields = document.getElementById('valueFields');
const linkFields = document.getElementById('linkFields');

function setOutput(data) {
  if (typeof data === 'string') {
    out.value = data;
    return;
  }
  out.value = JSON.stringify(data, null, 2);
}

function setHealth(text, isError) {
  healthOut.textContent = text;
  healthOut.classList.toggle('error', Boolean(isError));
}

async function readJSONResponse(response) {
  const text = await response.text();
  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

kind.addEventListener('change', () => {
  if (kind.value === 'link') {
    linkFields.classList.remove('hidden');
    valueFields.classList.add('hidden');
    return;
  }

  linkFields.classList.add('hidden');
  valueFields.classList.toggle('hidden', kind.value === 'entity');
});

document.getElementById('healthBtn').addEventListener('click', async () => {
  try {
    const response = await fetch('/api/health');
    const text = await response.text();
    if (!response.ok) {
      setHealth(`Error ${response.status}: ${text}`, true);
      return;
    }

    setHealth(text, false);
  } catch (error) {
    setHealth(String(error), true);
  }
});

document.getElementById('dumpBtn').addEventListener('click', async () => {
  try {
    const response = await fetch('/api/dump');
    const data = await readJSONResponse(response);
    if (!response.ok) {
      setOutput({ status: response.status, error: data });
      return;
    }

    setOutput(data);
  } catch (error) {
    setOutput({ error: String(error) });
  }
});

document.getElementById('getBtn').addEventListener('click', async () => {
  const id = document.getElementById('recordId').value.trim();
  if (!id) {
    setOutput({ error: 'Record ID is required' });
    return;
  }

  try {
    const response = await fetch(`/api/records/${encodeURIComponent(id)}`);
    const data = await readJSONResponse(response);
    if (!response.ok) {
      setOutput({ status: response.status, error: data });
      return;
    }

    setOutput(data);
  } catch (error) {
    setOutput({ error: String(error) });
  }
});

document.getElementById('createBtn').addEventListener('click', async () => {
  const payload = { kind: kind.value };

  if (kind.value === 'value') {
    payload.value = document.getElementById('valueInput').value;
  }

  if (kind.value === 'link') {
    payload.a = document.getElementById('linkA').value.trim();
    payload.b = document.getElementById('linkB').value.trim();
  }

  // try {
  //   const response = await fetch("/api/record/new", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify(payload),
  //   });

  //   const data = await readJSONResponse(response);
  //   if (!response.ok) {
  //     setOutput({ status: response.status, error: data });
  //     return;
  //   }

  //   setOutput(data);
  // } catch (error) {
  setOutput({ error: 'not yet implemented' });
  // }
});
