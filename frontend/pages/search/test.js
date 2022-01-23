let test = {
  filters: [
    { field: 'treeDetail.location', maxDistance: 150000, zip: '97980' },
    { field: 'price.priceValue', value: { $lte: '500' } },
    { field: 'treeDetail.fellingState.felled', value: false },
  ],
  sorter: { 'price.priceValue': '-1' },
  paging: { limit: 25, skip: 0 },
  search: { value: 'Test' },
}
