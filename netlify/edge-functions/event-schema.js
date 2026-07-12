export default async (request, context) => {
  return new Response('EDGE FUNCTION EXECUTED', {
    headers: { 'content-type': 'text/plain' },
  });
};

export const config = {
  path: ['/events', '/tickets'],
};
