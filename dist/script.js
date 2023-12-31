c = document.querySelector('#c')
c.width = 1920
c.height = 1080
x = c.getContext('2d')
C = Math.cos
S = Math.sin
t = 0
T = Math.tan

rsz=window.onresize=()=>{
  setTimeout(()=>{
    if(document.body.clientWidth > document.body.clientHeight*1.77777778){
      c.style.height = '100vh'
      setTimeout(()=>c.style.width = c.clientHeight*1.77777778+'px',0)
    }else{
      c.style.width = '100vw'
      setTimeout(()=>c.style.height =     c.clientWidth/1.77777778 + 'px',0)
    }
  },0)
}
rsz()

async function Draw(){
  
  if(!t){
    R=(Rl,Pt,Yw,m)=>{
      M=Math
      A=M.atan2
      H=M.hypot
      X=S(p=A(X,Z)+Yw)*(d=H(X,Z))
      Z=C(p)*d
      Y=S(p=A(Y,Z)+Pt)*(d=H(Y,Z))
      Z=C(p)*d
      X=S(p=A(X,Y)+Rl)*(d=H(X,Y))
      Y=C(p)*d
      if(m){
        X+=oX
        Y+=oY
        Z+=oZ
      }
    }
    Q=()=>[c.width/2+X/Z*900,c.height/2+Y/Z*900]
    I=(A,B,M,D,E,F,G,H)=>(K=((G-E)*(B-F)-(H-F)*(A-E))/(J=(H-F)*(M-A)-(G-E)*(D-B)))>=0&&K<=1&&(L=((M-A)*(B-F)-(D-B)*(A-E))/J)>=0&&L<=1?[A+K*(M-A),B+K*(D-B)]:0
    
    Rn = Math.random
    
    async function loadOBJ(url, scale, tx, ty, tz, rl, pt, yw) {
      let res
      await fetch(url, res => res).then(data=>data.text()).then(data=>{
        a=[]
        data.split("\nv ").map(v=>{
          a=[...a, v.split("\n")[0]]
        })
        a=a.filter((v,i)=>i).map(v=>[...v.split(' ').map(n=>(+n.replace("\n", '')))])
        ax=ay=az=0
        a.map(v=>{
          v[1]*=-1
          ax+=v[0]
          ay+=v[1]
          az+=v[2]
        })
        ax/=a.length
        ay/=a.length
        az/=a.length
        a.map(v=>{
          X=(v[0]-ax)*scale
          Y=(v[1]-ay)*scale
          Z=(v[2]-az)*scale
          R2(rl,pt,yw,0)
          v[0]=X
          v[1]=Y
          v[2]=Z
        })
        maxY=-6e6
        a.map(v=>{
          if(v[1]>maxY)maxY=v[1]
        })
        a.map(v=>{
          v[1]-=maxY-oY
          v[0]+=tx
          v[1]+=ty
          v[2]+=tz
        })

        b=[]
        data.split("\nf ").map(v=>{
          b=[...b, v.split("\n")[0]]
        })
        b.shift()
        b=b.map(v=>v.split(' '))
        b=b.map(v=>{
          v=v.map(q=>{
            return +q.split('/')[0]
          })
          v=v.filter(q=>q)
          return v
        })
        
        res=[]
        b.map(v=>{
          e=[]
          v.map(q=>{
            e=[...e, a[q-1]]
          })
          e = e.filter(q=>q)
          res=[...res, e]
        })
      })
      return res
    }

    geoSphere = (mx, my, mz, iBc, size) => {
      let collapse=0
      let B=Array(iBc).fill().map(v=>{
        X = Rn()-.5
        Y = Rn()-.5
        Z = Rn()-.5
        return  [X,Y,Z]
      })
      for(let m=200;m--;){
        B.map((v,i)=>{
          X = v[0]
          Y = v[1]
          Z = v[2]
          B.map((q,j)=>{
            if(j!=i){
              X2=q[0]
              Y2=q[1]
              Z2=q[2]
              d=1+(Math.hypot(X-X2,Y-Y2,Z-Z2)*(3+iBc/40)*3)**4
              X+=(X-X2)*500/d
              Y+=(Y-Y2)*500/d
              Z+=(Z-Z2)*500/d
            }
          })
          d=Math.hypot(X,Y,Z)
          v[0]=X/d
          v[1]=Y/d
          v[2]=Z/d
          if(collapse){
            d=25+Math.hypot(X,Y,Z)
            v[0]=(X-X/d)/1.1
            v[1]=(Y-Y/d)/1.1         
            v[2]=(Z-Z/d)/1.1
          }
        })
      }
      mind = 6e6
      B.map((v,i)=>{
        X1 = v[0]
        Y1 = v[1]
        Z1 = v[2]
        B.map((q,j)=>{
          X2 = q[0]
          Y2 = q[1]
          Z2 = q[2]
          if(i!=j){
            d = Math.hypot(a=X1-X2, b=Y1-Y2, e=Z1-Z2)
            if(d<mind) mind = d
          }
        })
      })
      a = []
      B.map((v,i)=>{
        X1 = v[0]
        Y1 = v[1]
        Z1 = v[2]
        B.map((q,j)=>{
          X2 = q[0]
          Y2 = q[1]
          Z2 = q[2]
          if(i!=j){
            d = Math.hypot(X1-X2, Y1-Y2, Z1-Z2)
            if(d<mind*2){
              if(!a.filter(q=>q[0]==X2&&q[1]==Y2&&q[2]==Z2&&q[3]==X1&&q[4]==Y1&&q[5]==Z1).length) a = [...a, [X1*size,Y1*size,Z1*size,X2*size,Y2*size,Z2*size]]
            }
          }
        })
      })
      B.map(v=>{
        v[0]*=size
        v[1]*=size
        v[2]*=size
        v[0]+=mx
        v[1]+=my
        v[2]+=mz
      })
      return [mx, my, mz, size, B, a]
    }

    lineFaceI = (X1, Y1, Z1, X2, Y2, Z2, facet, autoFlipNormals=false, showNormals=false) => {
      let X_, Y_, Z_, d, m, l_,K,J,L,p
      let I_=(A,B,M,D,E,F,G,H)=>(K=((G-E)*(B-F)-(H-F)*(A-E))/(J=(H-F)*(M-A)-(G-E)*(D-B)))>=0&&K<=1&&(L=((M-A)*(B-F)-(D-B)*(A-E))/J)>=0&&L<=1?[A+K*(M-A),B+K*(D-B)]:0
      let Q_=()=>[c.width/2+X_/Z_*600,c.height/2+Y_/Z_*600]
      let R_ = (Rl,Pt,Yw,m)=>{
        let M=Math, A=M.atan2, H=M.hypot
        X_=S(p=A(X_,Y_)+Rl)*(d=H(X_,Y_)),Y_=C(p)*d,X_=S(p=A(X_,Z_)+Yw)*(d=H(X_,Z_)),Z_=C(p)*d,Y_=S(p=A(Y_,Z_)+Pt)*(d=H(Y_,Z_)),Z_=C(p)*d
        if(m){ X_+=oX,Y_+=oY,Z_+=oZ }
      }
      let rotSwitch = m =>{
        switch(m){
          case 0: R_(0,0,Math.PI/2); break
          case 1: R_(0,Math.PI/2,0); break
          case 2: R_(Math.PI/2,0,Math.PI/2); break
        }        
      }
      let ax = 0, ay = 0, az = 0
      facet.map(q_=>{ ax += q_[0], ay += q_[1], az += q_[2] })
      ax /= facet.length, ay /= facet.length, az /= facet.length
      let b1 = facet[2][0]-facet[1][0], b2 = facet[2][1]-facet[1][1], b3 = facet[2][2]-facet[1][2]
      let c1 = facet[1][0]-facet[0][0], c2 = facet[1][1]-facet[0][1], c3 = facet[1][2]-facet[0][2]
      let crs = [b2*c3-b3*c2,b3*c1-b1*c3,b1*c2-b2*c1]
      d = Math.hypot(...crs)+.001
      let nls = 1 //normal line length
      crs = crs.map(q=>q/d*nls)
      let X1_ = ax, Y1_ = ay, Z1_ = az
      let flip = 1
      if(autoFlipNormals){
        let d1_ = Math.hypot(X1_-X1,Y1_-Y1,Z1_-Z1)
        let d2_ = Math.hypot(X1-(ax + crs[0]/99),Y1-(ay + crs[1]/99),Z1-(az + crs[2]/99))
        flip = d2_>d1_?-1:1
      }
      let X2_ = ax + (crs[0]*=flip), Y2_ = ay + (crs[1]*=flip), Z2_ = az + (crs[2]*=flip)
      if(showNormals){
        x.beginPath()
        X_ = X1_, Y_ = Y1_, Z_ = Z1_
        R_(Rl,Pt,Yw,1)
        if(Z_>0) x.lineTo(...Q_())
        X_ = X2_, Y_ = Y2_, Z_ = Z2_
        R_(Rl,Pt,Yw,1)
        if(Z_>0) x.lineTo(...Q_())
        x.lineWidth = 5
        x.strokeStyle='#f004'
        x.stroke()
      }
      
      let p1_ = Math.atan2(X2_-X1_,Z2_-Z1_)
      let p2_ = -(Math.acos((Y2_-Y1_)/(Math.hypot(X2_-X1_,Y2_-Y1_,Z2_-Z1_)+.001))+Math.PI/2)
      let isc = false, iscs = [false,false,false]
      X_ = X1, Y_ = Y1, Z_ = Z1
      R_(0,-p2_,-p1_)
      let rx_ = X_, ry_ = Y_, rz_ = Z_
      for(let m=3;m--;){
        if(isc === false){
          X_ = rx_, Y_ = ry_, Z_ = rz_
          rotSwitch(m)
          X1_ = X_, Y1_ = Y_, Z1_ = Z_ = 5, X_ = X2, Y_ = Y2, Z_ = Z2
          R_(0,-p2_,-p1_)
          rotSwitch(m)
          X2_ = X_, Y2_ = Y_, Z2_ = Z_
          facet.map((q_,j_)=>{
            if(isc === false){
              let l = j_
              X_ = facet[l][0], Y_ = facet[l][1], Z_ = facet[l][2]
              R_(0,-p2_,-p1_)
              rotSwitch(m)
              let X3_=X_, Y3_=Y_, Z3_=Z_
              l = (j_+1)%facet.length
              X_ = facet[l][0], Y_ = facet[l][1], Z_ = facet[l][2]
              R_(0,-p2_,-p1_)
              rotSwitch(m)
              let X4_ = X_, Y4_ = Y_, Z4_ = Z_
              if(l_=I_(X1_,Y1_,X2_,Y2_,X3_,Y3_,X4_,Y4_)) iscs[m] = l_
            }
          })
        }
      }
      if(iscs.filter(v=>v!==false).length==3){
        let iscx = iscs[1][0], iscy = iscs[0][1], iscz = iscs[0][0]
        let pointInPoly = true
        ax=0, ay=0, az=0
        facet.map((q_, j_)=>{ ax+=q_[0], ay+=q_[1], az+=q_[2] })
        ax/=facet.length, ay/=facet.length, az/=facet.length
        X_ = ax, Y_ = ay, Z_ = az
        R_(0,-p2_,-p1_)
        X1_ = X_, Y1_ = Y_, Z1_ = Z_
        X2_ = iscx, Y2_ = iscy, Z2_ = iscz
        facet.map((q_,j_)=>{
          if(pointInPoly){
            let l = j_
            X_ = facet[l][0], Y_ = facet[l][1], Z_ = facet[l][2]
            R_(0,-p2_,-p1_)
            let X3_ = X_, Y3_ = Y_, Z3_ = Z_
            l = (j_+1)%facet.length
            X_ = facet[l][0], Y_ = facet[l][1], Z_ = facet[l][2]
            R_(0,-p2_,-p1_)
            let X4_ = X_, Y4_ = Y_, Z4_ = Z_
            if(I_(X1_,Y1_,X2_,Y2_,X3_,Y3_,X4_,Y4_)) pointInPoly = false
          }
        })
        if(pointInPoly){
          X_ = iscx, Y_ = iscy, Z_ = iscz
          R_(0,p2_,0)
          R_(0,0,p1_)
          isc = [[X_,Y_,Z_], [crs[0],crs[1],crs[2]]]
        }
      }
      return isc
    }
    
    Cylinder = (rw,cl,ls1,ls2) => {
      let a = []
      for(let i=rw;i--;){
        let b = []
        for(let j=cl;j--;){
          X = S(p=Math.PI*2/cl*j) * ls1
          Y = (1/rw*i-.5)*ls2
          Z = C(p) * ls1
          b = [...b, [X,Y,Z]]
        }
        //a = [...a, b]
        for(let j=cl;j--;){
          b = []
          X = S(p=Math.PI*2/cl*j) * ls1
          Y = (1/rw*i-.5)*ls2
          Z = C(p) * ls1
          b = [...b, [X,Y,Z]]
          X = S(p=Math.PI*2/cl*(j+1)) * ls1
          Y = (1/rw*i-.5)*ls2
          Z = C(p) * ls1
          b = [...b, [X,Y,Z]]
          X = S(p=Math.PI*2/cl*(j+1)) * ls1
          Y = (1/rw*(i+1)-.5)*ls2
          Z = C(p) * ls1
          b = [...b, [X,Y,Z]]
          X = S(p=Math.PI*2/cl*j) * ls1
          Y = (1/rw*(i+1)-.5)*ls2
          Z = C(p) * ls1
          b = [...b, [X,Y,Z]]
          a = [...a, b]
        }
      }
      b = []
      for(let j=cl;j--;){
        X = S(p=Math.PI*2/cl*j) * ls1
        Y = ls2/2
        Z = C(p) * ls1
        b = [...b, [X,Y,Z]]
      }
      //a = [...a, b]
      return a
    }

    Tetrahedron = size => {
      ret = []
      a = []
      let h = size/1.4142/1.25
      for(i=3;i--;){
        X = S(p=Math.PI*2/3*i) * size/1.25
        Y = C(p) * size/1.25
        Z = h
        a = [...a, [X,Y,Z]]
      }
      ret = [...ret, a]
      for(j=3;j--;){
        a = []
        X = 0
        Y = 0
        Z = -h
        a = [...a, [X,Y,Z]]
        X = S(p=Math.PI*2/3*j) * size/1.25
        Y = C(p) * size/1.25
        Z = h
        a = [...a, [X,Y,Z]]
        X = S(p=Math.PI*2/3*(j+1)) * size/1.25
        Y = C(p) * size/1.25
        Z = h
        a = [...a, [X,Y,Z]]
        ret = [...ret, a]
      }
      ax=ay=az=ct=0
      ret.map(v=>{
        v.map(q=>{
          ax+=q[0]
          ay+=q[1]
          az+=q[2]
          ct++
        })
      })
      ax/=ct
      ay/=ct
      az/=ct
      ret.map(v=>{
        v.map(q=>{
          q[0]-=ax
          q[1]-=ay
          q[2]-=az
        })
      })
      return ret
    }

    Cube = size => {
      for(CB=[],j=6;j--;CB=[...CB,b])for(b=[],i=4;i--;)b=[...b,[(a=[S(p=Math.PI*2/4*i+Math.PI/4),C(p),2**.5/2])[j%3]*(l=j<3?size/1.5:-size/1.5),a[(j+1)%3]*l,a[(j+2)%3]*l]]
      return CB
    }
    
    Octahedron = size => {
      ret = []
      let h = size/1.25
      for(j=8;j--;){
        a = []
        X = 0
        Y = 0
        Z = h * (j<4?-1:1)
        a = [...a, [X,Y,Z]]
        X = S(p=Math.PI*2/4*j) * size/1.25
        Y = C(p) * size/1.25
        Z = 0
        a = [...a, [X,Y,Z]]
        X = S(p=Math.PI*2/4*(j+1)) * size/1.25
        Y = C(p) * size/1.25
        Z = 0
        a = [...a, [X,Y,Z]]
        ret = [...ret, a]
      }
      return ret      
    }
    
    Dodecahedron = size => {
      ret = []
      a = []
      mind = -6e6
      for(i=5;i--;){
        X=S(p=Math.PI*2/5*i + Math.PI/5)
        Y=C(p)
        Z=0
        if(Y>mind) mind=Y
        a = [...a, [X,Y,Z]]
      }
      a.map(v=>{
        X = v[0]
        Y = v[1]-=mind
        Z = v[2]
        R(0, .553573, 0)
        v[0] = X
        v[1] = Y
        v[2] = Z
      })
      b = JSON.parse(JSON.stringify(a))
      b.map(v=>{
        v[1] *= -1
      })
      ret = [...ret, a, b]
      mind = -6e6
      ret.map(v=>{
        v.map(q=>{
          X = q[0]
          Y = q[1]
          Z = q[2]
          if(Z>mind)mind = Z
        })
      })
      d1=Math.hypot(ret[0][0][0]-ret[0][1][0],ret[0][0][1]-ret[0][1][1],ret[0][0][2]-ret[0][1][2])
      ret.map(v=>{
        v.map(q=>{
          q[2]-=mind+d1/2
        })
      })
      b = JSON.parse(JSON.stringify(ret))
      b.map(v=>{
        v.map(q=>{
          q[2]*=-1
        })
      })
      ret = [...ret, ...b]
      b = JSON.parse(JSON.stringify(ret))
      b.map(v=>{
        v.map(q=>{
          X = q[0]
          Y = q[1]
          Z = q[2]
          R(0,0,Math.PI/2)
          R(0,Math.PI/2,0)
          q[0] = X
          q[1] = Y
          q[2] = Z
        })
      })
      e = JSON.parse(JSON.stringify(ret))
      e.map(v=>{
        v.map(q=>{
          X = q[0]
          Y = q[1]
          Z = q[2]
          R(0,0,Math.PI/2)
          R(Math.PI/2,0,0)
          q[0] = X
          q[1] = Y
          q[2] = Z
        })
      })
      ret = [...ret, ...b, ...e]
      ret.map(v=>{
        v.map(q=>{
          q[0] *= size/2
          q[1] *= size/2
          q[2] *= size/2
        })
      })
      return ret
    }
    
    Icosahedron = size => {
      ret = []
      B = [
        [[0,3],[1,0],[2,2]],
        [[0,3],[1,0],[1,3]],
        [[0,3],[2,3],[1,3]],
        [[0,2],[2,1],[1,0]],
        [[0,2],[1,3],[1,0]],
        [[0,2],[1,3],[2,0]],
        [[0,3],[2,2],[0,0]],
        [[1,0],[2,2],[2,1]],
        [[1,1],[2,2],[2,1]],
        [[1,1],[2,2],[0,0]],
        [[1,1],[2,1],[0,1]],
        [[0,2],[2,1],[0,1]],
        [[2,0],[1,2],[2,3]],
        [[0,0],[0,3],[2,3]],
        [[1,3],[2,0],[2,3]],
        [[2,3],[0,0],[1,2]],
        [[1,2],[2,0],[0,1]],
        [[0,0],[1,2],[1,1]],
        [[0,1],[1,2],[1,1]],
        [[0,2],[2,0],[0,1]],
      ]
      for(p=[1,1],i=38;i--;)p=[...p,p[l=p.length-1]+p[l-1]]
      phi = p[l]/p[l-1]
      a = [
        [-phi,-1,0],
        [phi,-1,0],
        [phi,1,0],
        [-phi,1,0],
      ]
      for(j=3;j--;ret=[...ret, b])for(b=[],i=4;i--;) b = [...b, [a[i][j],a[i][(j+1)%3],a[i][(j+2)%3]]]
      ret.map(v=>{
        v.map(q=>{
          q[0]*=size/2.25
          q[1]*=size/2.25
          q[2]*=size/2.25
        })
      })
      cp = JSON.parse(JSON.stringify(ret))
      out=[]
      a = []
      B.map(v=>{
        idx1a = v[0][0]
        idx2a = v[1][0]
        idx3a = v[2][0]
        idx1b = v[0][1]
        idx2b = v[1][1]
        idx3b = v[2][1]
        a = [...a, [cp[idx1a][idx1b],cp[idx2a][idx2b],cp[idx3a][idx3b]]]
      })
      out = [...out, ...a]
      return out
    }
    
    stroke = (scol, fcol, lwo=1, od=true, oga=1) => {
      if(scol){
        x.closePath()
        if(od) x.globalAlpha = .2*oga
        x.strokeStyle = scol
        x.lineWidth = Math.min(1000,100*lwo/Z)
        if(od) x.stroke()
        x.lineWidth /= 4
        x.globalAlpha = 1*oga
        x.stroke()
      }
      if(fcol){
        x.globalAlpha = 1*oga
        x.fillStyle = fcol
        x.fill()
      }
    }
    
    subbed = (subs, size, sphereize, shape) => {
      for(let m=subs; m--;){
        base = shape
        shape = []
        base.map(v=>{
          l = 0
          X1 = v[l][0]
          Y1 = v[l][1]
          Z1 = v[l][2]
          l = 1
          X2 = v[l][0]
          Y2 = v[l][1]
          Z2 = v[l][2]
          l = 2
          X3 = v[l][0]
          Y3 = v[l][1]
          Z3 = v[l][2]
          if(v.length > 3){
            l = 3
            X4 = v[l][0]
            Y4 = v[l][1]
            Z4 = v[l][2]
            if(v.length > 4){
              l = 4
              X5 = v[l][0]
              Y5 = v[l][1]
              Z5 = v[l][2]
            }
          }
          mx1 = (X1+X2)/2
          my1 = (Y1+Y2)/2
          mz1 = (Z1+Z2)/2
          mx2 = (X2+X3)/2
          my2 = (Y2+Y3)/2
          mz2 = (Z2+Z3)/2
          a = []
          switch(v.length){
            case 3:
              mx3 = (X3+X1)/2
              my3 = (Y3+Y1)/2
              mz3 = (Z3+Z1)/2
              X = X1, Y = Y1, Z = Z1, a = [...a, [X,Y,Z]]
              X = mx1, Y = my1, Z = mz1, a = [...a, [X,Y,Z]]
              X = mx3, Y = my3, Z = mz3, a = [...a, [X,Y,Z]]
              shape = [...shape, a]
              a = []
              X = mx1, Y = my1, Z = mz1, a = [...a, [X,Y,Z]]
              X = X2, Y = Y2, Z = Z2, a = [...a, [X,Y,Z]]
              X = mx2, Y = my2, Z = mz2, a = [...a, [X,Y,Z]]
              shape = [...shape, a]
              a = []
              X = mx3, Y = my3, Z = mz3, a = [...a, [X,Y,Z]]
              X = mx2, Y = my2, Z = mz2, a = [...a, [X,Y,Z]]
              X = X3, Y = Y3, Z = Z3, a = [...a, [X,Y,Z]]
              shape = [...shape, a]
              a = []
              X = mx1, Y = my1, Z = mz1, a = [...a, [X,Y,Z]]
              X = mx2, Y = my2, Z = mz2, a = [...a, [X,Y,Z]]
              X = mx3, Y = my3, Z = mz3, a = [...a, [X,Y,Z]]
              shape = [...shape, a]
              break
            case 4:
              mx3 = (X3+X4)/2
              my3 = (Y3+Y4)/2
              mz3 = (Z3+Z4)/2
              mx4 = (X4+X1)/2
              my4 = (Y4+Y1)/2
              mz4 = (Z4+Z1)/2
              cx = (X1+X2+X3+X4)/4
              cy = (Y1+Y2+Y3+Y4)/4
              cz = (Z1+Z2+Z3+Z4)/4
              X = X1, Y = Y1, Z = Z1, a = [...a, [X,Y,Z]]
              X = mx1, Y = my1, Z = mz1, a = [...a, [X,Y,Z]]
              X = cx, Y = cy, Z = cz, a = [...a, [X,Y,Z]]
              X = mx4, Y = my4, Z = mz4, a = [...a, [X,Y,Z]]
              shape = [...shape, a]
              a = []
              X = mx1, Y = my1, Z = mz1, a = [...a, [X,Y,Z]]
              X = X2, Y = Y2, Z = Z2, a = [...a, [X,Y,Z]]
              X = mx2, Y = my2, Z = mz2, a = [...a, [X,Y,Z]]
              X = cx, Y = cy, Z = cz, a = [...a, [X,Y,Z]]
              shape = [...shape, a]
              a = []
              X = cx, Y = cy, Z = cz, a = [...a, [X,Y,Z]]
              X = mx2, Y = my2, Z = mz2, a = [...a, [X,Y,Z]]
              X = X3, Y = Y3, Z = Z3, a = [...a, [X,Y,Z]]
              X = mx3, Y = my3, Z = mz3, a = [...a, [X,Y,Z]]
              shape = [...shape, a]
              a = []
              X = mx4, Y = my4, Z = mz4, a = [...a, [X,Y,Z]]
              X = cx, Y = cy, Z = cz, a = [...a, [X,Y,Z]]
              X = mx3, Y = my3, Z = mz3, a = [...a, [X,Y,Z]]
              X = X4, Y = Y4, Z = Z4, a = [...a, [X,Y,Z]]
              shape = [...shape, a]
              break
            case 5:
              cx = (X1+X2+X3+X4+X5)/5
              cy = (Y1+Y2+Y3+Y4+Y5)/5
              cz = (Z1+Z2+Z3+Z4+Z5)/5
              mx3 = (X3+X4)/2
              my3 = (Y3+Y4)/2
              mz3 = (Z3+Z4)/2
              mx4 = (X4+X5)/2
              my4 = (Y4+Y5)/2
              mz4 = (Z4+Z5)/2
              mx5 = (X5+X1)/2
              my5 = (Y5+Y1)/2
              mz5 = (Z5+Z1)/2
              X = X1, Y = Y1, Z = Z1, a = [...a, [X,Y,Z]]
              X = X2, Y = Y2, Z = Z2, a = [...a, [X,Y,Z]]
              X = cx, Y = cy, Z = cz, a = [...a, [X,Y,Z]]
              shape = [...shape, a]
              a = []
              X = X2, Y = Y2, Z = Z2, a = [...a, [X,Y,Z]]
              X = X3, Y = Y3, Z = Z3, a = [...a, [X,Y,Z]]
              X = cx, Y = cy, Z = cz, a = [...a, [X,Y,Z]]
              shape = [...shape, a]
              a = []
              X = X3, Y = Y3, Z = Z3, a = [...a, [X,Y,Z]]
              X = X4, Y = Y4, Z = Z4, a = [...a, [X,Y,Z]]
              X = cx, Y = cy, Z = cz, a = [...a, [X,Y,Z]]
              shape = [...shape, a]
              a = []
              X = X4, Y = Y4, Z = Z4, a = [...a, [X,Y,Z]]
              X = X5, Y = Y5, Z = Z5, a = [...a, [X,Y,Z]]
              X = cx, Y = cy, Z = cz, a = [...a, [X,Y,Z]]
              shape = [...shape, a]
              a = []
              X = X5, Y = Y5, Z = Z5, a = [...a, [X,Y,Z]]
              X = X1, Y = Y1, Z = Z1, a = [...a, [X,Y,Z]]
              X = cx, Y = cy, Z = cz, a = [...a, [X,Y,Z]]
              shape = [...shape, a]
              a = []
              break
          }
        })
      }
      if(sphereize){
        ip1 = sphereize
        ip2 = 1-sphereize
        shape = shape.map(v=>{
          v = v.map(q=>{
            X = q[0]
            Y = q[1]
            Z = q[2]
            d = Math.hypot(X,Y,Z)
            X /= d
            Y /= d
            Z /= d
            X *= size*.75*ip1 + d*ip2
            Y *= size*.75*ip1 + d*ip2
            Z *= size*.75*ip1 + d*ip2
            return [X,Y,Z]
          })
          return v
        })
      }
      return shape
    }
    
    subDividedIcosahedron  = (size, subs, sphereize = 0) => subbed(subs, size, sphereize, Icosahedron(size))
    subDividedTetrahedron  = (size, subs, sphereize = 0) => subbed(subs, size, sphereize, Tetrahedron(size))
    subDividedOctahedron   = (size, subs, sphereize = 0) => subbed(subs, size, sphereize, Octahedron(size))
    subDividedCube         = (size, subs, sphereize = 0) => subbed(subs, size, sphereize, Cube(size))
    subDividedDodecahedron = (size, subs, sphereize = 0) => subbed(subs, size, sphereize, Dodecahedron(size))
    
    Rn = Math.random
    
    LsystemRecurse = (size, splits, p1, p2, stem, theta, LsystemReduction, twistFactor) => {
      if(size < .5) return
      let X1 = stem[0]
      let Y1 = stem[1]
      let Z1 = stem[2]
      let X2 = stem[3]
      let Y2 = stem[4]
      let Z2 = stem[5]
      let p1a = Math.atan2(X2-X1,Z2-Z1)
      let p2a = -Math.acos((Y2-Y1)/(Math.hypot(X2-X1,Y2-Y1,Z2-Z1)+.0001))+Math.PI
      size/=LsystemReduction
      for(let i=splits;i--;){
        X = 0
        Y = -size
        Z = 0
        R(0, theta, 0)
        R(0, 0, Math.PI*2/splits*i+twistFactor)
        R(0, p2a, 0)
        R(0, 0, p1a+twistFactor)
        X+=X2
        Y+=Y2
        Z+=Z2
        let newStem = [X2, Y2, Z2, X, Y, Z]
        Lshp = [...Lshp, newStem]
        LsystemRecurse(size, splits, p1+Math.PI*2/splits*i+twistFactor, p2+theta, newStem, theta, LsystemReduction, twistFactor)
      }
    }
    DrawLsystem = shp => {
      shp.map(v=>{
        x.beginPath()
        X = v[0]
        Y = v[1]
        Z = v[2]
        R(Rl,Pt,Yw,1)
        if(Z>0)x.lineTo(...Q())
        X = v[3]
        Y = v[4]
        Z = v[5]
        R(Rl,Pt,Yw,1)
        if(Z>0)x.lineTo(...Q())
        lwo = Math.hypot(v[0]-v[3],v[1]-v[4],v[2]-v[5])
        stroke('#0f82','',lwo)
      })
      
    }
    Lsystem = (size, splits, theta, LsystemReduction, twistFactor) => {
      Lshp = []
      stem = [0,0,0,0,-size,0]
      Lshp = [...Lshp, stem]
      LsystemRecurse(size, splits, 0, 0, stem, theta, LsystemReduction, twistFactor)
      Lshp.map(v=>{
        v[1]+=size*1.5
        v[4]+=size*1.5
      })
      return Lshp
    }
    
    Sphere = (ls, rw, cl) => {
      a = []
      ls/=1.25
      for(j = rw; j--;){
        for(i = cl; i--;){
          b = []
          X = S(p = Math.PI*2/cl*i) * S(q = Math.PI/rw*j) * ls
          Y = C(q) * ls
          Z = C(p) * S(q) * ls
          b = [...b, [X,Y,Z]]
          X = S(p = Math.PI*2/cl*(i+1)) * S(q = Math.PI/rw*j) * ls
          Y = C(q) * ls
          Z = C(p) * S(q) * ls
          b = [...b, [X,Y,Z]]
          X = S(p = Math.PI*2/cl*(i+1)) * S(q = Math.PI/rw*(j+1)) * ls
          Y = C(q) * ls
          Z = C(p) * S(q) * ls
          b = [...b, [X,Y,Z]]
          X = S(p = Math.PI*2/cl*i) * S(q = Math.PI/rw*(j+1)) * ls
          Y = C(q) * ls
          Z = C(p) * S(q) * ls
          b = [...b, [X,Y,Z]]
          a = [...a, b]
        }
      }
      return a
    }
    
    Torus = (rw, cl, ls1, ls2, parts=1, twists=0, part_spacing=1.5) => {
      let ret = [], tx=0, ty=0, tz=0
      for(let m=parts;m--;){
        avgs = Array(rw).fill().map(v=>[0,0,0])
        for(j=rw;j--;)for(let i = cl;i--;){
          if(parts>1){
            ls3 = ls1*part_spacing
            X = S(p=Math.PI*2/parts*m) * ls3
            Y = C(p) * ls3
            Z = 0
            R(prl1 = Math.PI*2/rw*(j-1)*twists,0,0)
            tx1 = X
            ty1 = Y 
            tz1 = Z
            R(0, 0, Math.PI*2/rw*(j-1))
            ax1 = X
            ay1 = Y
            az1 = Z
            X = S(p=Math.PI*2/parts*m) * ls3
            Y = C(p) * ls3
            Z = 0
            R(prl2 = Math.PI*2/rw*(j)*twists,0,0)
            tx2 = X
            ty2 = Y
            tz2 = Z
            R(0, 0, Math.PI*2/rw*j)
            ax2 = X
            ay2 = Y
            az2 = Z
            p1a = Math.atan2(ax2-ax1,az2-az1)
            p2a = Math.PI/2+Math.acos((ay2-ay1)/(Math.hypot(ax2-ax1,ay2-ay1,az2-az1)+.001))

            X = S(p=Math.PI*2/parts*m) * ls3
            Y = C(p) * ls3
            Z = 0
            R(Math.PI*2/rw*(j)*twists,0,0)
            tx1b = X
            ty1b = Y
            tz1b = Z
            R(0, 0, Math.PI*2/rw*j)
            ax1b = X
            ay1b = Y
            az1b = Z
            X = S(p=Math.PI*2/parts*m) * ls3
            Y = C(p) * ls3
            Z = 0
            R(Math.PI*2/rw*(j+1)*twists,0,0)
            tx2b = X
            ty2b = Y
            tz2b = Z
            R(0, 0, Math.PI*2/rw*(j+1))
            ax2b = X
            ay2b = Y
            az2b = Z
            p1b = Math.atan2(ax2b-ax1b,az2b-az1b)
            p2b = Math.PI/2+Math.acos((ay2b-ay1b)/(Math.hypot(ax2b-ax1b,ay2b-ay1b,az2b-az1b)+.001))
          }
          a = []
          X = S(p=Math.PI*2/cl*i) * ls1
          Y = C(p) * ls1
          Z = 0
          //R(0,0,-p1a)
          R(prl1,p2a,0)
          X += ls2 + tx1, Y += ty1, Z += tz1
          R(0, 0, Math.PI*2/rw*j)
          a = [...a, [X,Y,Z]]
          X = S(p=Math.PI*2/cl*(i+1)) * ls1
          Y = C(p) * ls1
          Z = 0
          //R(0,0,-p1a)
          R(prl1,p2a,0)
          X += ls2 + tx1, Y += ty1, Z += tz1
          R(0, 0, Math.PI*2/rw*j)
          a = [...a, [X,Y,Z]]
          X = S(p=Math.PI*2/cl*(i+1)) * ls1
          Y = C(p) * ls1
          Z = 0
          //R(0,0,-p1b)
          R(prl2,p2b,0)
          X += ls2 + tx2, Y += ty2, Z += tz2
          R(0, 0, Math.PI*2/rw*(j+1))
          a = [...a, [X,Y,Z]]
          X = S(p=Math.PI*2/cl*i) * ls1
          Y = C(p) * ls1
          Z = 0
          //R(0,0,-p1b)
          R(prl2,p2b,0)
          X += ls2 + tx2, Y += ty2, Z += tz2
          R(0, 0, Math.PI*2/rw*(j+1))
          a = [...a, [X,Y,Z]]
          ret = [...ret, a]
        }
      }
      return ret
    }

    grav = .05
    floor_base = 0
    shps = []
    shpFreq = 100
    iShpv2 = .5
    iShpRv = .4
    iShpRv2 = .02
    spawnShp = () => {
      iShpv = .1 * (.5+Rn()/2)
      ipFlex = Rn()<.5 ? 0 : 4-Rn()**3*3
      ls = 16 / (1 + ipFlex/2)
      G = 25
      tx = 0//(Rn()-.5) * G
      ty = -20
      tz = 0//(Rn()-.5) * G
      switch(Rn()*5|0){
        case 0:
          ls_ = ls * 1
          newShp = subDividedTetrahedron(ls_,3,ipFlex)
          break
        case 1:
          ls_ = ls * 1
          newShp = subDividedCube(ls_,2,ipFlex)
          break
        case 2:
          ls_ = ls * 1
          newShp = subDividedOctahedron(ls_,2,ipFlex)
          break
        case 3:
          ls_ = ls * 1
          newShp = subDividedDodecahedron(ls_,1,ipFlex)
          break
        case 4:
          ls_ = ls * 1
          newShp = subDividedIcosahedron(ls_,1,ipFlex)
          break
      }
      vx = S(t*8) * iShpv*5
      vy = -1
      vz = C(t*8) * iShpv*5
      
      rl=pt=yw=0
      switch(Rn()*3|0){
        case 0:
          rl = (Rn()-.5) * iShpRv;
          pt = (Rn()-.5) * iShpRv;
          break
        case 1:
          pt = (Rn()-.5) * iShpRv;
          yw = (Rn()-.5) * iShpRv;
          break
        case 2:
          yw = (Rn()-.5) * iShpRv;
          rl = (Rn()-.5) * iShpRv;
          break
      }
      irl = Rn()*Math.PI*2
      ipt = Rn()*Math.PI*2
      iyw = Rn()*Math.PI*2
      newShp = newShp.map(v=>{
        vx2 = (Rn()-.5) * iShpv2
        vy2 = - grav * .5 - Rn() * iShpv2
        vz2 = (Rn()-.5) * iShpv2
        rl2=pt2=yw2=0
        switch(Rn()*3|0){
          case 0:
            rl2 = (Rn()-.5) * iShpRv2;
            pt2 = (Rn()-.5) * iShpRv2;
            break
          case 1:
            pt2 = (Rn()-.5) * iShpRv2;
            yw2 = (Rn()-.5) * iShpRv2;
            break
          case 2:
            yw2 = (Rn()-.5) * iShpRv2;
            rl2 = (Rn()-.5) * iShpRv2;
            break
        }
        v = [v, 0, 0, 0, vx2, vy2, vz2, 0, 0, 0, rl2, pt2, yw2, false, 0, 1]
        return v
      })
      shps = [...shps, [tx, ty, tz, newShp, 1, vx, vy, vz, irl, ipt, iyw, rl, pt, yw]]
    }
    
    rw=100, cl=200, ls = 1, sp=2
    floor = []
    Array(rw*cl).fill().map((v,i) => {
      a = []
      X = tx = ((i%cl)-cl/2+.5)*sp*1.5 + ((i/cl|0)%2?sp*.75:0)
      Y = ty = floor_base
      Z = tz = ((i/cl|0)-rw/2+.5)*sp/2*(.75**.5)-sp/3
      R(0,0,Math.PI/2)
      tx = X
      ty = Y
      tz = Z
      d = Math.hypot(tx,tz)
      if((((((i/cl|0)*.5)+i*2)%2))&&d<23){
        for(j=6;j--;){
          X = tx + S(p=Math.PI*2/6*j) * ls
          Y = ty
          Z = tz + C(p) * ls
          //R(0,Math.PI/2,0)
          a = [...a, [X,Y,Z]]
        }
        floor = [...floor, a]
      }
    })

  
    selective_sub = v => {
      l = 0
      X1 = v[l][0]
      Y1 = v[l][1]
      Z1 = v[l][2]
      l = 1
      X2 = v[l][0]
      Y2 = v[l][1]
      Z2 = v[l][2]
      l = 2
      X3 = v[l][0]
      Y3 = v[l][1]
      Z3 = v[l][2]
      if(v.length > 3){
        l = 3
        X4 = v[l][0]
        Y4 = v[l][1]
        Z4 = v[l][2]
        if(v.length > 4){
          l = 4
          X5 = v[l][0]
          Y5 = v[l][1]
          Z5 = v[l][2]
        }
      }
      mx1 = (X1+X2)/2
      my1 = (Y1+Y2)/2
      mz1 = (Z1+Z2)/2
      mx2 = (X2+X3)/2
      my2 = (Y2+Y3)/2
      mz2 = (Z2+Z3)/2
      a = []
      switch(v.length){
        case 3:
          mx3 = (X3+X1)/2
          my3 = (Y3+Y1)/2
          mz3 = (Z3+Z1)/2
          X = X1, Y = Y1, Z = Z1, a = [...a, [X,Y,Z]]
          X = mx1, Y = my1, Z = mz1, a = [...a, [X,Y,Z]]
          X = mx3, Y = my3, Z = mz3, a = [...a, [X,Y,Z]]
          shape = [...shape, a]
          a = []
          X = mx1, Y = my1, Z = mz1, a = [...a, [X,Y,Z]]
          X = X2, Y = Y2, Z = Z2, a = [...a, [X,Y,Z]]
          X = mx2, Y = my2, Z = mz2, a = [...a, [X,Y,Z]]
          shape = [...shape, a]
          a = []
          X = mx3, Y = my3, Z = mz3, a = [...a, [X,Y,Z]]
          X = mx2, Y = my2, Z = mz2, a = [...a, [X,Y,Z]]
          X = X3, Y = Y3, Z = Z3, a = [...a, [X,Y,Z]]
          shape = [...shape, a]
          a = []
          X = mx1, Y = my1, Z = mz1, a = [...a, [X,Y,Z]]
          X = mx2, Y = my2, Z = mz2, a = [...a, [X,Y,Z]]
          X = mx3, Y = my3, Z = mz3, a = [...a, [X,Y,Z]]
          shape = [...shape, a]
          break
        case 4:
          mx3 = (X3+X4)/2
          my3 = (Y3+Y4)/2
          mz3 = (Z3+Z4)/2
          mx4 = (X4+X1)/2
          my4 = (Y4+Y1)/2
          mz4 = (Z4+Z1)/2
          cx = (X1+X2+X3+X4)/4
          cy = (Y1+Y2+Y3+Y4)/4
          cz = (Z1+Z2+Z3+Z4)/4
          X = X1, Y = Y1, Z = Z1, a = [...a, [X,Y,Z]]
          X = mx1, Y = my1, Z = mz1, a = [...a, [X,Y,Z]]
          X = cx, Y = cy, Z = cz, a = [...a, [X,Y,Z]]
          X = mx4, Y = my4, Z = mz4, a = [...a, [X,Y,Z]]
          shape = [...shape, a]
          a = []
          X = mx1, Y = my1, Z = mz1, a = [...a, [X,Y,Z]]
          X = X2, Y = Y2, Z = Z2, a = [...a, [X,Y,Z]]
          X = mx2, Y = my2, Z = mz2, a = [...a, [X,Y,Z]]
          X = cx, Y = cy, Z = cz, a = [...a, [X,Y,Z]]
          shape = [...shape, a]
          a = []
          X = cx, Y = cy, Z = cz, a = [...a, [X,Y,Z]]
          X = mx2, Y = my2, Z = mz2, a = [...a, [X,Y,Z]]
          X = X3, Y = Y3, Z = Z3, a = [...a, [X,Y,Z]]
          X = mx3, Y = my3, Z = mz3, a = [...a, [X,Y,Z]]
          shape = [...shape, a]
          a = []
          X = mx4, Y = my4, Z = mz4, a = [...a, [X,Y,Z]]
          X = cx, Y = cy, Z = cz, a = [...a, [X,Y,Z]]
          X = mx3, Y = my3, Z = mz3, a = [...a, [X,Y,Z]]
          X = X4, Y = Y4, Z = Z4, a = [...a, [X,Y,Z]]
          shape = [...shape, a]
          break
        case 5:
          cx = (X1+X2+X3+X4+X5)/5
          cy = (Y1+Y2+Y3+Y4+Y5)/5
          cz = (Z1+Z2+Z3+Z4+Z5)/5
          mx3 = (X3+X4)/2
          my3 = (Y3+Y4)/2
          mz3 = (Z3+Z4)/2
          mx4 = (X4+X5)/2
          my4 = (Y4+Y5)/2
          mz4 = (Z4+Z5)/2
          mx5 = (X5+X1)/2
          my5 = (Y5+Y1)/2
          mz5 = (Z5+Z1)/2
          X = X1, Y = Y1, Z = Z1, a = [...a, [X,Y,Z]]
          X = X2, Y = Y2, Z = Z2, a = [...a, [X,Y,Z]]
          X = cx, Y = cy, Z = cz, a = [...a, [X,Y,Z]]
          shape = [...shape, a]
          a = []
          X = X2, Y = Y2, Z = Z2, a = [...a, [X,Y,Z]]
          X = X3, Y = Y3, Z = Z3, a = [...a, [X,Y,Z]]
          X = cx, Y = cy, Z = cz, a = [...a, [X,Y,Z]]
          shape = [...shape, a]
          a = []
          X = X3, Y = Y3, Z = Z3, a = [...a, [X,Y,Z]]
          X = X4, Y = Y4, Z = Z4, a = [...a, [X,Y,Z]]
          X = cx, Y = cy, Z = cz, a = [...a, [X,Y,Z]]
          shape = [...shape, a]
          a = []
          X = X4, Y = Y4, Z = Z4, a = [...a, [X,Y,Z]]
          X = X5, Y = Y5, Z = Z5, a = [...a, [X,Y,Z]]
          X = cx, Y = cy, Z = cz, a = [...a, [X,Y,Z]]
          shape = [...shape, a]
          a = []
          X = X5, Y = Y5, Z = Z5, a = [...a, [X,Y,Z]]
          X = X1, Y = Y1, Z = Z1, a = [...a, [X,Y,Z]]
          X = cx, Y = cy, Z = cz, a = [...a, [X,Y,Z]]
          shape = [...shape, a]
          a = []
          break
      }
    }
    
    sparks = []
    iSparksv = .4
    spawnSparks = (tx,ty,tz,num) => {
      for(m=(2*(num+1))|0;m--;){
        vx = (Rn()-.5)*iSparksv
        vy = -(Rn())*iSparksv
        vz = (Rn()-.5)*iSparksv
        sparks = [...sparks, [tx,ty,tz,vx,vy,vz,1]]
      }
    }
    G_ = 100000, iSTc = 5e3
    ST = Array(iSTc).fill().map(v=>{
      X = (Rn()-.5)*G_
      Y = (Rn()-.5)*G_
      Z = (Rn()-.5)*G_
      return [X,Y,Z]
    })
  }
  
  if(!((t*60|0)%shpFreq)) spawnShp()
  oX=0, oY=6, oZ=Math.min(120, Math.max(50,(.3+C(t/2))*250))
  Rl=C(t/2)/8, Pt=-.3+C(t)/4, Yw=Math.PI/2+S(t/2)
  
  x.globalAlpha = 1
  x.fillStyle='#000C'
  x.fillRect(0,0,c.width,c.height)
  x.lineJoin = x.lineCap = 'roud'

  ST.map(v=>{
    X = v[0]
    Y = v[1]
    Z = v[2]
    R(Rl,Pt,Yw,1)
    if(Z>0){
      if((x.globalAlpha = Math.min(1,(Z/3000)**2))>.1){
        s = Math.min(1e3, 500000/Z)
        x.fillStyle = '#ffffff04'
        l = Q()
        x.fillRect(l[0]-s/2,l[1]-s/2,s,s)
        s/=5
        x.fillStyle = '#fffa'
        x.fillRect(l[0]-s/2,l[1]-s/2,s,s)
      }
    }
  })

  x.globalAlpha = 1
  
  
  if(1){
      x.beginPath()
      for(i=40;i--;){
        X = S(p=Math.PI*2/40*i) * G/1.05
        Y = floor_base
        Z = C(p) * G/1.05
        R(Rl,Pt,Yw,1)
        if(Z>0) x.lineTo(...Q())
      }
      stroke('#40f3','#4400ff15',10,1)

      floor.map(v=>{
      x.beginPath()
      v.map(q=>{
        X = q[0]
        Y = q[1]
        Z = q[2]
        R(Rl,Pt,Yw,1)
        if(Z>0) x.lineTo(...Q())
      })
      stroke('#f001','#3333',5,0)
    })
  }
  shps = shps.filter(v=>v[4]>0 && v[1]<floor_base+500)
  
sparks = sparks.filter(v=>v[6]>.1)
  
  sparks.map(v=>{
    X = v[0] += v[3]
    Y = v[1] += v[4] += grav
    Z = v[2] += v[5]
    //v[3] /= 1.5
    //v[4] /= 1.5
    //v[5] /= 1.5
    d = Math.hypot(X,Z)
    if(d<G/1.1){
      if(Y>floor_base){
        Y = floor_base
        v[4] *= v[4] > 0 ? -1 : 1
      }
    }
    v[6]-=.03
    R(Rl,Pt,Yw,1)
    if(Z>0){
      l = Q()
      s = Math.min(1e3, 6000/Z*v[6])
      x.fillStyle = '#ff000004'
      x.fillRect(l[0]-s/2,l[1]-s/2,s,s)
      s/=3
      x.fillStyle = '#ff880020'
      x.fillRect(l[0]-s/2,l[1]-s/2,s,s)
      s/=4
      x.fillStyle = '#ffffffff'
      x.fillRect(l[0]-s/2,l[1]-s/2,s,s)
    }
  })
  
  
  shps.map(v => {
    tx  = v[0]  += v[5]
    ty_ = v[1]  += v[6] += grav
    tz  = v[2]  += v[7]
    rl = v[8]  += v[11]
    pt = v[9]  += v[12]
    yw = v[10] += v[13]
    v[3].map(q => {
      ty = q[13] ? v[6] : ty_
      ax = ay = az = 0
      q[0].map(n => {
        ax += n[0] + q[1]
        ay += n[1] + q[2]
        az += n[2] + q[3]
      })
      ax /= q[0].length
      ay /= q[0].length
      az /= q[0].length
      if(ay + ty > floor_base) {
        if(!q[13]){
          if(d__ < G/1.1){
            spawnSparks(ax+tx, ay+ty, az+tz, v[4])
            q[14] += 50
            q[4] += v[5]*.75
            q[5] *= q[5] > 0 ? -.75 : 1
            q[6] += v[7]*.75
            v[5] /= 1.05
            v[7] /= 1.05
            q[13] = true
          }
        }
      }
      
      if(q[13]){
        q[15] -= .25
        q[5] += grav
        if(ay+ty>floor_base){
          d__ = Math.hypot(ax+tx, az+tz)
          if(d__<G/1.1 && ay+ty < floor_base+5){
            if(ay+ty>floor_base+.5) q[2] -= 1
            q[5] *= q[5] > 0 ? -.5 : 1
            //spawnSparks(tx + ax,floor_base, tz + az, v[4])
          }
        }
        rl = q[7] += q[10]
        pt = q[8] += q[11]
        yw = q[9] += q[12]
      }

      x.beginPath()
      maxd = -6e6
      q[0].map(n=>{
        olx=oly=olz = 0
        /*X = ax + tx
        Y = ay + ty
        Z = az + tz
        x.fillStyle = '#0f0'
        R(Rl,Pt,Yw,1)
        if(Z>0){
          s = Math.min(1e3,500/Z)
          l = Q()
          x.fillRect(l[0]-s/2,l[1]-s/2,s,s)
        }*/
        X = n[0]
        Y = n[1]
        Z = n[2]
        if(q[13]){
          ax__ = ay__ = az__ = 0
          q[0].map(n_=>{
            ax__ += n_[0]
            ay__ += n_[1]
            az__ += n_[2]
          })
          ax__/=q[0].length
          ay__/=q[0].length
          az__/=q[0].length
          X = n[0] - ax__
          Y = n[1] - ay__
          Z = n[2] - az__
          R(q[7],q[8],q[9])
          X = n[0] = X + ax__
          Y = n[1] = Y + ay__
          Z = n[2] = Z + az__
          q[7] += q[10]
          q[8] += q[11]
          q[9] += q[12]
          q[10] /= 1.2
          q[11] /= 1.2
          q[12] /= 1.2
          q[1] += q[4]
          q[2] += q[5]
          q[3] += q[6]
          if(ay+ty > floor_base){
            d__ = Math.hypot(ax+tx, az+tz)
            if(d__ < G/1.1 && ay+ty <floor_base+5){
              if(Rn()<.15)spawnSparks(tx + ax, floor_base, tz + az, v[4])
              q[4] *= .99
              q[6] *= .99
            }
          }
          if(q[15]>0){
            q[2]=(floor_base-(ty+ay))/2
          }
        }else{
          R(v[11],v[12],v[13])
          n[0] = X
          n[1] = Y
          n[2] = Z
        }
        X += tx + q[1]
        Y += ty + q[2]
        Z += tz + q[3]
        d__ = Math.hypot(X,Z)
        R(Rl,Pt,Yw,1)
        if(Z>0) x.lineTo(...Q())
      })
      flash = q[14] /= 1.1
      col1 = `hsla(${t*50},99%,${70 + flash**2}%,${v[4]**.05*(1+flash/8)})`
      col2 = `hsla(${t*50},99%,${50 + flash**2}%,${v[4]**.3*.2*(1+flash/15)})`
      if(maxd<.03) stroke(col1, col2, 6, false)
    })
    v[4] -= .0075
  })

  t+=1/60
  requestAnimationFrame(Draw)
}
Draw()