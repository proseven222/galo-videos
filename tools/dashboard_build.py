# uso: python3 tools/dashboard_build.py  -> escreve /home/claude/dash/data.js a partir de dashboard/posts.json + dashboard/thumbs/vNN.jpg
import json,base64,os,datetime,sys
R=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
P=json.load(open(os.path.join(R,'dashboard/posts.json'),encoding='utf-8'))['posts']
for p in P:
    f=os.path.join(R,'dashboard/thumbs',p['id']+'.jpg')
    p['thumb']='data:image/jpeg;base64,'+base64.b64encode(open(f,'rb').read()).decode() if os.path.exists(f) else ''
P.sort(key=lambda p:(p['date'],p['time']))
data={'updated':datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ'),'posts':P}
os.makedirs('/home/claude/dash',exist_ok=True)
open('/home/claude/dash/data.js','w',encoding='utf-8').write('window.GALO_DATA = '+json.dumps(data,ensure_ascii=False).replace('</','<\\/')+';\n')
print(len(P),'posts ->','/home/claude/dash/data.js')
