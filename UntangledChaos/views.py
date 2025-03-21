from agora_token_builder import RtcTokenBuilder
from django.http import JsonResponse
import time
import random
def index(request):
    return render(request,'index.html')


def getAppointmentToken(request):
    appId = '1d7a7b82261a4bfeb81b4fc429cb98af'
    appCertificate = '98e28f649f7d4cb198bcf3368dce44ea'
    channelName = request.GET.get('channel')
    # it should be between those number
    uid = random.randint(1,200)  
    # token expires in 24 hrs 
    expirationTime = 3600 *24  
    currentTimeStamp = time.time()
    privilegeExpiredTs =  currentTimeStamp + expirationTime
    role = 2
    token = RtcTokenBuilder.buildTokenWithUid(appId, appCertificate, channelName, uid, role, privilegeExpiredTs)
    return JsonResponse({'token':token, 'uid':uid}, safe=False)