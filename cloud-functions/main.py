import datetime
import logging
import os

import functions_framework
from google.cloud import datastore as datastore_module


_DATASTORE_NAMESPACE = 'g0v-timeline'
_DATASTORE_KEY = 'user-event'

_DATASTORE_CLIENT = None


def _VerifyReCaptchaV3Token(token):
  import requests

  secret_key = os.environ.get('RECAPTCHA_V3_SECRET_KEY')
  if not secret_key:
    return False

  response = requests.post(
      'https://www.google.com/recaptcha/api/siteverify',
      data={
        'secret': secret_key,
        'response': token,
      })
  response = response.json()
  logging.info('verify response: %r', response)
  return response['success']


def GetDatastoreClient():
  global _DATASTORE_CLIENT
  if _DATASTORE_CLIENT is None:
    _DATASTORE_CLIENT = datastore_module.Client(namespace=_DATASTORE_NAMESPACE)
  return _DATASTORE_CLIENT


def CheckLength(string, limit):
  try:
    string.encode('ascii')
    # This is an ASCII string, let's be more generous.
    return len(string) <= limit * 3
  except UnicodeEncodeError:
    # Contains non-ascii characters, assume it's Chinese.
    return len(string) <= limit


def allow_cors(func):
  def wrapped(request):
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

    try:
      retval = func(request)
      if isinstance(retval, tuple):
        response, status = retval
      else:
        response, status = retval, 200

      return response, status, headers
    except Exception as e:
      return (str(e), 500, headers)

  return wrapped

@functions_framework.http
@allow_cors
def add_event(request):
  if request.method != 'POST':
    return 'Please use POST method', 400

  date = request.form.get('date')
  subject = request.form.get('subject')
  description = request.form.get('description')
  token = request.form.get('token')
  if not (date and subject and description):
    return ({'message': 'Fields "date", "subject", "description" are required'},
            400)

  if not (token and _VerifyReCaptchaV3Token(token)):
    return ({'message': 'A valid ReCaptchaV3 Token is required'}, 400)

  try:
    # This follows the HTML format.
    datetime.datetime.strptime(date, '%Y-%m-%d')
  except ValueError:
    return {'message': 'Date should be in %Y-%m-%d format'}, 400

  if not CheckLength(subject, 10) or not CheckLength(description, 20):
    return ({'message': 'The subject or description is too long...'},
            400)

  added_time = datetime.datetime.now().timestamp()

  client = GetDatastoreClient()
  entity = datastore_module.Entity(client.key(_DATASTORE_KEY))
  entity.update({
    'date': date,
    'subject': subject,
    'description': description,
    'added_time': added_time,
    'hidden': False,
  })
  client.put(entity)

  return ({'message': f'wrote: {date!r}, {subject!r}, {description!r} to DB'},
          200)


@functions_framework.http
@allow_cors
def get_events(request):
  client = GetDatastoreClient()

  try:
    limit = int(request.args.get('limit'))
  except Exception:
    limit = 500
  try:
    after_timestamp = float(request.args.get('after_timestamp'))
  except Exception:
    after_timestamp = None

  query = client.query(kind=_DATASTORE_KEY)
  if after_timestamp is not None:
    query.add_filter('added_time', '>=', after_timestamp)
  query.add_filter('hidden', '=', False)
  query.order = ['-added_time']
  results = []
  for result in query.fetch(limit=limit):
    results.append(dict(id=result.id, **result))

  return ({'results': results}, 200)


@functions_framework.http
@allow_cors
def take_down_event(request):
  client = GetDatastoreClient()

  try:
    event_id = int(request.form.get('event_id'))
    assert request.form.get('secret') == os.environ.get('TAKE_DOWN_SECRET')
  except Exception:
    return ({'message': 'bad request'}, 401)

  key = client.key(_DATASTORE_KEY, event_id)
  entity = client.get(key)
  if entity is None:
    return ({'message': 'No such event'}, 200)
  entity.update({'hidden': True})
  client.put(entity)
  return ({'message': 'Ok'}, 200)
