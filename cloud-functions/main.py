import datetime

import functions_framework
from google.cloud import datastore as datastore_module


_DATASTORE_NAMESPACE = 'g0v-timeline'
_DATASTORE_KEY = 'user-event'

_DATASTORE_CLIENT = None

def GetDatastoreClient():
  global _DATASTORE_CLIENT
  if _DATASTORE_CLIENT is None:
    _DATASTORE_CLIENT = datastore_module.Client(namespace=_DATASTORE_NAMESPACE)
  return _DATASTORE_CLIENT


@functions_framework.http
def hello_get(request):
  return {'message': 'hello world!'}


@functions_framework.http
def add_event(request):
  if request.method == 'OPTIONS':
    # Allows GET requests from any origin with the Content-Type
    # header and caches preflight response for an 3600s
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '3600'
    }
    return ('', 204, headers)

  # Set CORS headers for the main request
  headers = {
      'Access-Control-Allow-Origin': '*'
  }

  if request.method != 'POST':
    return 'Please use POST method', 400

  date = request.form.get('date')
  subject = request.form.get('subject')
  description = request.form.get('description')
  if not (date and subject and description):
    return ({'message': 'Fields "date", "subject", "description" are required'},
            400)

  try:
    # This follows the HTML format.
    datetime.datetime.strptime(date, '%Y-%m-%d')
  except ValueError:
    return 'Date should be in %Y-%m-%d format', 400

  if len(subject) + len(description) > 20:
    return (
      {'message':
          'Total length of "subject" and "description" should not exeed 20'},
      400)

  added_time = datetime.datetime.now().isoformat()

  client = GetDatastoreClient()
  entity = datastore_module.Entity(client.key(_DATASTORE_KEY))
  entity.update({
    'date': date,
    'subject': subject,
    'description': description,
    'added_time': added_time,
  })
  client.put(entity)

  return ({'message': f'wrote: {date!r}, {subject!r}, {description!r} to DB'},
          200,
          headers)


@functions_framework.http
def get_events(request):
  if request.method == 'OPTIONS':
    # Allows GET requests from any origin with the Content-Type
    # header and caches preflight response for an 3600s
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '3600'
    }
    return ('', 204, headers)

  # Set CORS headers for the main request
  headers = {
      'Access-Control-Allow-Origin': '*'
  }

  client = GetDatastoreClient()
  query = client.query(kind=_DATASTORE_KEY)
  query.order = ['-added_time']
  results = []
  for result in query.fetch(limit=100):
    results.append(dict(**result))

  return ({'results': results}, 200, headers)
