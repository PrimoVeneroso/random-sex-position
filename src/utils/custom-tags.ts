export function getCustomTags() {
  return JSON.parse(localStorage.getItem('CUSTOM_TAGS') || '{}');
}
export function updateCustomTags(id: number, tags: any) {
  const all = getCustomTags();
  all[id] = { ...all[id], ...tags };
  localStorage.setItem('CUSTOM_TAGS', JSON.stringify(all));
}
