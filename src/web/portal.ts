const portal = document.getElementById('portal') as HTMLDivElement;

if (!(portal instanceof HTMLDivElement)) {
  throw new Error('Portal element not found or is not an HTMLDivElement');
}
