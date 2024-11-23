const GRIDLINES_URLS = {
  MAIN_URL: process.env.GRIDLINES_URL,
  PAN_VERIFY: 'pan-api/v2/verify',
  PAN_FETCH: 'pan-api/fetch',
};

const GST_URLS = {
  MAIN_URL: process.env.GSTVERIFY_URL,
  GST_VERIFY: '/verify/gstin',
  ACCOUNT_VERIFY: '/verify/bank',
  ACCOUNT_STATUS: '/verify/status',
  CHEQUE_VERIFY: '/document/extract'
}


module.exports = {
  GRIDLINES_URLS,
  GST_URLS
};
