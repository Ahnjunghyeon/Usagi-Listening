export function gradeForScore(points:number):string {
 if(points===0)return '꽝';
 if(points<=20)return '5급';
 if(points<=40)return '4급';
 if(points<=69)return '3급';
 if(points<=89)return '2급';
 return '1급';
}
const ink='#151039';
const outer='M 183 102 C 315 100 392 103 500 97 C 639 105 721 84 867 96 C 1017 98 1129 115 1250 109 L 1335 109 Q 1410 111 1419 205 C 1430 358 1439 543 1441 728 L 1441 851 Q 1440 944 1341 958 C 1180 979 1023 964 856 972 C 655 965 470 973 303 963 L 178 956 Q 93 950 86 869 C 74 727 86 591 85 460 C 84 329 93 265 95 191 Q 98 104 183 102 Z';
const inner='M 633 164 C 473 169 370 166 257 175 Q 159 170 158 261 C 146 394 151 505 151 611 C 144 725 146 789 162 842 Q 174 901 240 901 C 390 913 494 897 624 905 C 833 909 1020 914 1189 909 L 1300 906 Q 1377 903 1377 825 C 1383 663 1373 513 1367 369 L 1355 246 Q 1347 177 1278 174 C 1132 161 1060 169 952 171 L 882 167';
function stroke(ctx: CanvasRenderingContext2D, path: string, width=18, fill?:string) {const p=new Path2D(path);ctx.lineWidth=width;ctx.strokeStyle=ink;ctx.lineCap='round';ctx.lineJoin='round';if(fill){ctx.fillStyle=fill;ctx.fill(p);}ctx.stroke(p);}
function loadImage(src: string): Promise<HTMLImageElement> {return new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>reject(new Error('Image load failed'));img.src=src;});}
export async function drawCertificate(name:string,points:number,portraitUrl:string):Promise<string> {
 const grade=gradeForScore(points),paper='#fff3d6';
 const [portrait]=await Promise.all([loadImage(portraitUrl),document.fonts.load('700 190px "Gaegu"',`우사기언어평가${grade}${name}수험생0123456789점·` )]);
 const canvas=document.createElement('canvas');canvas.width=1536;canvas.height=1024;
 const ctx=canvas.getContext('2d');if(!ctx)throw new Error('Canvas unavailable');
 stroke(ctx,outer,22,paper);stroke(ctx,inner,19);
 stroke(ctx,'M 684 139 L 741 161 L 768 125 L 784 160 L 834 139 L 813 204 Q 758 213 710 205 Z',16,'#c7dfa3');
 stroke(ctx,'M 153 530 C 373 529 622 533 950 531 M 1308 501 L 1369 499',17);
 ctx.save();ctx.beginPath();ctx.rect(963,253,328,333);ctx.clip();ctx.fillStyle=paper;ctx.fillRect(963,253,328,333);
 const scale=Math.min(328/portrait.naturalWidth,333/portrait.naturalHeight);
 const w=portrait.naturalWidth*scale,h=portrait.naturalHeight*scale;ctx.drawImage(portrait,963+(328-w)/2,253+(333-h)/2,w,h);ctx.restore();
 stroke(ctx,'M 965 585 C 957 477 955 361 952 249 Q 981 238 1041 242 C 1121 244 1190 231 1240 243 L 1285 245 M 1297 266 Q 1305 421 1307 565 M 990 595 Q 1100 590 1166 596 Q 1247 595 1290 587',17);
 ctx.fillStyle=ink;ctx.textAlign='center';ctx.textBaseline='middle';
 ctx.font='700 125px "Gaegu", sans-serif';ctx.fillText('우사기',530,325,690);ctx.fillText('언어평가',530,450,690);
 ctx.font='700 195px "Gaegu", sans-serif';ctx.fillText(grade,768,675,950);
 ctx.font='700 58px "Gaegu", sans-serif';ctx.fillText(`${name||'수험생'}`,768,835,1000);
 return canvas.toDataURL('image/png');
}
