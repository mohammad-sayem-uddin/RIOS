"""
RIOS Atlas v1.1 — Helper functions and diagram generators
"""
import os, math
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch

DIAGRAM_DIR = "atlas_diagrams_v11"
os.makedirs(DIAGRAM_DIR, exist_ok=True)

# Color Palette
C = {
    "navy":"#1B2A4A","deep_blue":"#1E3A5F","steel":"#2E5090",
    "accent":"#3B82F6","sky":"#60A5FA","light_blue":"#DBEAFE",
    "teal":"#0D9488","emerald":"#059669","green":"#10B981",
    "light_green":"#D1FAE5","amber":"#D97706","gold":"#F59E0B",
    "light_amber":"#FEF3C7","red":"#DC2626","light_red":"#FEE2E2",
    "slate":"#334155","gray":"#6B7280","light_gray":"#F1F5F9",
    "mid_gray":"#E2E8F0","white":"#FFFFFF","black":"#0F172A",
    "purple":"#7C3AED","light_purple":"#EDE9FE","rose":"#E11D48",
}

def save_fig(fig, name, dpi=200):
    path = os.path.join(DIAGRAM_DIR, f"{name}.png")
    fig.savefig(path, dpi=dpi, bbox_inches="tight", facecolor=fig.get_facecolor(),
                edgecolor="none", pad_inches=0.3)
    plt.close(fig)
    return path

def sbox(ax, x, y, w, h, text, fc, tc="white", fs=9, wt="bold",
         ec=None, rad=0.02, alpha=1.0, zo=2):
    box = FancyBboxPatch((x,y),w,h,boxstyle=f"round,pad={rad}",
                         facecolor=fc,edgecolor=ec or fc,
                         linewidth=1.2,alpha=alpha,zorder=zo)
    ax.add_patch(box)
    if text:
        ax.text(x+w/2,y+h/2,text,ha="center",va="center",fontsize=fs,
                color=tc,fontweight=wt,zorder=zo+1,wrap=True)

def arr(ax,x1,y1,x2,y2,col=C["gray"],st="-|>",lw=1.5):
    ax.annotate("",xy=(x2,y2),xytext=(x1,y1),
                arrowprops=dict(arrowstyle=st,color=col,lw=lw))

def clean(fig,ax,title="",bg=C["white"]):
    ax.set_xlim(0,10); ax.set_ylim(0,10)
    ax.set_aspect("equal"); ax.axis("off")
    fig.patch.set_facecolor(bg); ax.set_facecolor(bg)
    if title:
        ax.set_title(title,fontsize=13,fontweight="bold",color=C["navy"],pad=12)

# ── FOUNDATION DIAGRAMS ─────────────────────────────────────────────

def d_FOUND_001():
    fig,ax=plt.subplots(figsize=(10,8))
    clean(fig,ax,"RIOS System Overview — Architecture Landscape")
    sbox(ax,2.9,9.0,4.2,0.8,"RIOS — Research Identity Operating System",C["navy"],fs=12)
    y=7.8
    for label,col in [
        ("Identity Domain — Architectural Root",C["navy"]),
        ("Knowledge Domain — Scientific Knowledge",C["teal"]),
        ("Communication — Narrative + Scholarly",C["emerald"]),
        ("Visualization — Scientific Understanding",C["accent"]),
        ("Motion — Cognitive Evolution",C["purple"])]:
        sbox(ax,3.0,y,4.0,0.9,label,col,fs=10)
        if y>6.0: arr(ax,5.0,y,5.0,y-0.15)
        y-=1.2
    sbox(ax,0.2,2.0,2.2,3.5,"Platform\nEngineering\n\nService Arch\nAPI Gateway\nData Layer\nInfra",C["slate"],fs=8,wt="normal")
    sbox(ax,7.6,2.0,2.2,3.5,"Implementation\n\nRepository\nCI/CD\nDeployment\nMonitoring",C["slate"],fs=8,wt="normal")
    sbox(ax,1.5,0.5,7.0,1.0,"Foundation — MAB · CTD · DDM · DOM · DMS · AGS · RTS",C["deep_blue"],fs=9)
    return save_fig(fig,"ATL-FOUND-001")

def d_FOUND_002():
    fig,ax=plt.subplots(figsize=(10,10))
    clean(fig,ax,"RIOS Architecture Vision — Core Philosophy")
    circ=plt.Circle((5,5),1.8,color=C["navy"],zorder=5)
    ax.add_patch(circ)
    ax.text(5,5.2,"RIOS",ha="center",va="center",fontsize=16,color="white",fontweight="bold",zorder=6)
    ax.text(5,4.7,"Vision",ha="center",va="center",fontsize=11,color=C["sky"],zorder=6)
    principles=[("Architecture\nBefore\nImpl",C["steel"]),("Identity\nfrom Knowledge",C["teal"]),
                ("Evidence Before\nConclusions",C["emerald"]),("Knowledge Before\nDocuments",C["accent"]),
                ("Questions Before\nProjects",C["purple"]),("Semantic\nIntegrity",C["rose"])]
    r=3.5
    for i,(t,col) in enumerate(principles):
        a=math.pi/2+i*2*math.pi/len(principles)
        x,y=5+r*math.cos(a),5+r*math.sin(a)
        sbox(ax,x-0.8,y-0.5,1.6,1.0,t,col,fs=7.5)
        ax.plot([5,x],[5,y],color=C["mid_gray"],lw=1.5,zorder=1,ls="--")
    return save_fig(fig,"ATL-FOUND-002")

def d_FOUND_003():
    fig,ax=plt.subplots(figsize=(10,8))
    clean(fig,ax,"Ten Architecture Principles")
    ps=[("AP-001","Knowledge Before Documents","Knowledge is the source; documents are artifacts"),
        ("AP-002","Questions Before Projects","Scientific inquiry drives implementation"),
        ("AP-003","Evidence Before Conclusions","Claims require supporting evidence"),
        ("AP-004","Identity Before Presentation","Who you are precedes how you appear"),
        ("AP-005","Architecture Before Implementation","Design governs code"),
        ("AP-006","Semantic Integrity","Meaning is preserved across all layers"),
        ("AP-007","Technology Independence","Architecture is not bound to tools"),
        ("AP-008","Long-Term Preservation","Decisions serve the future"),
        ("AP-009","Interface Communication","Interfaces communicate; they do not define"),
        ("AP-010","Scientific Communication","Research understanding drives presentation")]
    y=9.0
    sbox(ax,0.3,y,1.2,0.5,"ID",C["navy"],fs=8)
    sbox(ax,1.6,y,3.0,0.5,"Principle",C["navy"],fs=8)
    sbox(ax,4.7,y,5.0,0.5,"Meaning",C["navy"],fs=8)
    y-=0.6
    alt=[C["light_blue"],C["white"]]
    for i,(pid,nm,me) in enumerate(ps):
        bg=alt[i%2]
        sbox(ax,0.3,y,1.2,0.45,pid,bg,C["navy"],fs=7,ec=C["mid_gray"])
        sbox(ax,1.6,y,3.0,0.45,nm,bg,C["black"],fs=8,ec=C["mid_gray"])
        sbox(ax,4.7,y,5.0,0.45,me,bg,C["slate"],fs=7,wt="normal",ec=C["mid_gray"])
        y-=0.55
    ax.text(5.0,y-0.2,"All principles are normative. Violation requires architectural review.",
            ha="center",fontsize=8,color=C["gray"],style="italic")
    return save_fig(fig,"ATL-FOUND-003")

def d_FOUND_004():
    fig,ax=plt.subplots(figsize=(10,8))
    clean(fig,ax,"Seven Architecture Layers")
    ls=[("Layer 7","Verification","Conformance & Validation",C["slate"]),
        ("Layer 6","Implementation","Technology Realization",C["slate"]),
        ("Layer 5","Requirements","Behavioral Specifications",C["steel"]),
        ("Layer 4","Models","Domain & Entity Models",C["accent"]),
        ("Layer 3","Domains","Bounded Contexts",C["teal"]),
        ("Layer 2","Principles","Architecture Rules",C["emerald"]),
        ("Layer 1","Vision","Why RIOS Exists",C["navy"])]
    y=1.0
    for i,(lay,nm,desc,col) in enumerate(ls):
        sbox(ax,0.5,y,9.0,0.95,"",col,alpha=0.9)
        ax.text(1.0,y+0.5,lay,ha="left",va="center",fontsize=9,color="white",fontweight="bold")
        ax.text(2.5,y+0.5,nm,ha="left",va="center",fontsize=11,color="white",fontweight="bold")
        ax.text(5.5,y+0.5,desc,ha="left",va="center",fontsize=9,color=C["light_blue"],style="italic")
        y+=1.15
    return save_fig(fig,"ATL-FOUND-004")

def d_FOUND_005():
    fig,ax=plt.subplots(figsize=(12,8))
    clean(fig,ax,"RIOS Domain Overview — Eight Primary Domains")
    sbox(ax,3.0,9.2,4.0,0.6,"Research Identity Operating System",C["navy"],fs=11)
    ds=[(0.5,7.0,"Identity","IDN","Who the\nresearcher is",C["navy"]),
        (3.6,7.0,"Knowledge","KNO","What is\nknown",C["teal"]),
        (6.7,7.0,"Narrative","NAR","How it is\ntold",C["emerald"]),
        (0.5,4.5,"Publication","PUB","Research\noutputs",C["steel"]),
        (3.6,4.5,"Visualization","VIS","How it is\nunderstood",C["accent"]),
        (6.7,4.5,"Motion","MOT","How identity\nevolves",C["purple"]),
        (1.5,2.0,"Engineering","ENG","Software\nquality",C["slate"]),
        (5.5,2.0,"Evolution","EVO","Long-term\ngrowth",C["gray"])]
    for x,y,nm,cd,desc,col in ds:
        sbox(ax,x,y,2.8,1.8,"",col,alpha=0.12,ec=col)
        sbox(ax,x,y+1.3,2.8,0.5,f"{nm} ({cd})",col,fs=9)
        ax.text(x+1.4,y+0.7,desc,ha="center",va="center",fontsize=8,color=C["slate"],style="italic")
    sbox(ax,1.5,0.5,7.0,0.8,"Foundation Architecture (Volume 0)",C["deep_blue"],fs=9)
    return save_fig(fig,"ATL-FOUND-005")

def d_FOUND_006():
    fig,ax=plt.subplots(figsize=(10,7))
    clean(fig,ax,"RIOS Architecture Stack — Knowledge Flow")
    bs=[("Knowledge",C["navy"]),("Artifacts",C["steel"]),("Presentation",C["accent"]),("Interface",C["teal"])]
    y=7.0
    for i,(nm,col) in enumerate(bs):
        w=8.0-i*0.5; x=(10-w)/2
        sbox(ax,x,y,w,1.2,nm,col,fs=14)
        if i<len(bs)-1: arr(ax,5.0,y,5.0,y-0.25,lw=2)
        y-=1.6
    ax.text(5.0,1.5,"NOT",ha="center",va="center",fontsize=14,color=C["red"],fontweight="bold")
    y=0.8
    for nm in ["Interface","Presentation","Artifacts","Knowledge"]:
        sbox(ax,2.5,y,5.0,0.4,nm,C["light_gray"],C["gray"],fs=7,ec=C["mid_gray"])
        y-=0.45
    return save_fig(fig,"ATL-FOUND-006")

def d_FOUND_007():
    fig,ax=plt.subplots(figsize=(10,9))
    clean(fig,ax,"RIOS Dependency Architecture — Directed Acyclic Graph")
    ds={"Identity":(5.0,8.5,C["navy"]),"Knowledge":(5.0,7.0,C["teal"]),
        "Narrative":(2.5,5.5,C["emerald"]),"Publication":(7.5,5.5,C["steel"]),
        "Visualization":(5.0,4.0,C["accent"]),"Motion":(2.5,2.5,C["purple"]),
        "Engineering":(7.5,2.5,C["slate"]),"Evolution":(5.0,1.0,C["gray"])}
    for nm,(x,y,col) in ds.items():
        sbox(ax,x-1.0,y-0.4,2.0,0.8,nm,col,fs=10)
    deps=[("Identity","Knowledge"),("Knowledge","Narrative"),("Knowledge","Publication"),
          ("Identity","Narrative"),("Identity","Visualization"),("Narrative","Visualization"),
          ("Narrative","Motion"),("Visualization","Motion"),("Identity","Engineering"),
          ("Knowledge","Engineering"),("Motion","Engineering"),("Engineering","Evolution")]
    for src,dst in deps:
        sx,sy,_=ds[src]; dx,dy,_=ds[dst]
        arr(ax,sx,sy-0.4,dx,dy+0.4,lw=1.2)
    ax.text(0.5,0.5,"Dependencies flow downward only.\nNo circular dependencies.\nIdentity is the architectural root.",
            fontsize=8,color=C["gray"],style="italic",va="bottom")
    return save_fig(fig,"ATL-FOUND-007")

def d_FOUND_008():
    fig,ax=plt.subplots(figsize=(12,8))
    clean(fig,ax,"RIOS Capability Map — Domain Responsibilities")
    gs=[{"t":"Identity & Knowledge","col":C["navy"],"x":0.3,"y":5.5,"w":4.5,"h":4.0,
         "items":[("Identity","Researcher definition, agenda, areas"),("Knowledge","Claims, evidence, ontology")]},
        {"t":"Communication","col":C["emerald"],"x":5.2,"y":5.5,"w":4.5,"h":4.0,
         "items":[("Narrative","Storytelling, audience, engagement"),("Scholarly","Publication lifecycle, peer review")]},
        {"t":"Understanding","col":C["accent"],"x":0.3,"y":1.0,"w":4.5,"h":4.0,
         "items":[("Visualization","Knowledge graphs, dashboards"),("Motion","Trajectory, evolution, milestones")]},
        {"t":"Engineering & Operations","col":C["slate"],"x":5.2,"y":1.0,"w":4.5,"h":4.0,
         "items":[("Platform","Services, API, data, infrastructure"),("Implementation","Repo, CI/CD, deployment")]}]
    for g in gs:
        sbox(ax,g["x"],g["y"],g["w"],g["h"],"",g["col"],alpha=0.06,ec=g["col"])
        ax.text(g["x"]+0.2,g["y"]+g["h"]-0.3,g["t"],fontsize=10,fontweight="bold",color=g["col"])
        iy=g["y"]+g["h"]-1.0
        for nm,desc in g["items"]:
            sbox(ax,g["x"]+0.2,iy,g["w"]-0.4,0.9,"",g["col"],alpha=0.1,ec=g["col"])
            ax.text(g["x"]+0.4,iy+0.6,nm,fontsize=9,fontweight="bold",color=g["col"])
            ax.text(g["x"]+0.4,iy+0.3,desc,fontsize=7,color=C["slate"],style="italic")
            iy-=1.2
    return save_fig(fig,"ATL-FOUND-008")

def d_FOUND_009():
    fig,ax=plt.subplots(figsize=(10,8))
    clean(fig,ax,"System Context Diagram")
    for x,y,nm in [(1.0,7.5,"Researcher"),(8.0,7.5,"AI Agent"),(1.0,1.5,"Institution"),(8.0,1.5,"Community")]:
        sbox(ax,x-0.7,y-0.3,1.4,0.6,nm,C["gray"],fs=8)
    sbox(ax,2.5,3.0,5.0,4.0,"",C["light_blue"],alpha=0.15,ec=C["accent"])
    sbox(ax,3.0,6.0,4.0,0.7,"RIOS",C["navy"],fs=14)
    for x,y,nm,col in [(3.2,5.0,"Identity",C["navy"]),(5.5,5.0,"Knowledge",C["teal"]),
                        (3.2,4.0,"Communication",C["emerald"]),(5.5,4.0,"Engineering",C["slate"]),
                        (4.3,3.2,"Visualization",C["accent"])]:
        sbox(ax,x,y,1.8,0.6,nm,col,fs=7)
    arr(ax,1.7,7.5,3.0,6.5); arr(ax,8.3,7.5,7.0,6.5)
    arr(ax,1.7,1.5,3.0,3.5); arr(ax,8.3,1.5,7.0,3.5)
    return save_fig(fig,"ATL-FOUND-009")

def d_FOUND_010():
    fig,ax=plt.subplots(figsize=(10,7))
    clean(fig,ax,"Architecture Hierarchy — Document Inheritance Chain")
    cs=[("MAB","Master Architecture\nBlueprint",C["navy"]),("CTD","Canonical Terminology\nDictionary",C["deep_blue"]),
        ("DDM","Domain Dependency\nMatrix",C["steel"]),("DOM","Domain Ownership\nMatrix",C["teal"]),
        ("DMS","Domain Model\nSpecification",C["emerald"]),("DS","Domain\nSpecifications",C["accent"]),
        ("IMP","Implementation\nCode",C["purple"])]
    y=8.5
    for i,(cd,nm,col) in enumerate(cs):
        sbox(ax,1.5,y,1.5,0.7,cd,col,fs=10)
        sbox(ax,3.2,y,4.5,0.7,nm,col,fs=8,wt="normal")
        if i<len(cs)-1: arr(ax,2.25,y,2.25,y-0.2,lw=2)
        y-=1.15
    ax.text(8.5,5.0,"Lower documents\nSHALL NOT\nredefine\nhigher-level\ndecisions",
            ha="center",va="center",fontsize=9,color=C["gray"],style="italic",
            bbox=dict(boxstyle="round,pad=0.3",facecolor=C["light_gray"],edgecolor=C["mid_gray"]))
    return save_fig(fig,"ATL-FOUND-010")

def d_FOUND_011():
    fig,ax=plt.subplots(figsize=(10,8))
    clean(fig,ax,"Architecture Flow — From Vision to Verification")
    ss=[(5.0,8.5,"Vision",C["navy"]),(7.5,7.0,"Principles",C["deep_blue"]),
        (8.0,4.5,"Domains",C["steel"]),(6.5,2.5,"Models",C["teal"]),
        (3.5,2.5,"Requirements",C["emerald"]),(2.0,4.5,"Implementation",C["accent"]),
        (2.5,7.0,"Verification",C["purple"])]
    for i in range(len(ss)):
        x1,y1,_,_=ss[i]; x2,y2,_,_=ss[(i+1)%len(ss)]
        ax.annotate("",xy=(x2,y2),xytext=(x1,y1),
                    arrowprops=dict(arrowstyle="-|>",color=C["mid_gray"],lw=2,connectionstyle="arc3,rad=0.2"))
    for x,y,nm,col in ss:
        circ=plt.Circle((x,y),0.6,color=col,zorder=5)
        ax.add_patch(circ)
        ax.text(x,y,nm,ha="center",va="center",fontsize=8,color="white",fontweight="bold",zorder=6)
    ax.text(5.0,5.5,"Architecture\nPrecedes\nImplementation",ha="center",va="center",
            fontsize=11,color=C["navy"],fontweight="bold",
            bbox=dict(boxstyle="round,pad=0.4",facecolor=C["light_blue"],edgecolor=C["accent"],lw=2))
    return save_fig(fig,"ATL-FOUND-011")

# ── IDENTITY DIAGRAMS ───────────────────────────────────────────────

def d_IDN_001():
    fig,ax=plt.subplots(figsize=(10,8))
    clean(fig,ax,"Identity Domain — Eight Components")
    sbox(ax,3.0,9.0,4.0,0.6,"Identity Domain (IDN)",C["navy"],fs=12)
    cs=[(0.5,7.0,"Vision Engine","Defines research\npurpose & direction",C["navy"]),
        (5.5,7.0,"Agenda Manager","Manages primary &\nsecondary agendas",C["deep_blue"]),
        (0.5,5.0,"Area Registry","Tracks research\nareas & evolution",C["steel"]),
        (5.5,5.0,"Dossier Builder","Constructs complete\nresearch profile",C["teal"]),
        (0.5,3.0,"Identity Verification","Validates identity\nclaims & evidence",C["emerald"]),
        (5.5,3.0,"Evolution Tracker","Monitors identity\nchanges over time",C["accent"]),
        (0.5,1.0,"Semantic Validator","Ensures meaning\nconsistency",C["purple"]),
        (5.5,1.0,"Identity Interface","Exposes identity\ncapabilities",C["slate"])]
    for x,y,nm,desc,col in cs:
        sbox(ax,x,y,4.0,1.4,"",col,alpha=0.08,ec=col)
        sbox(ax,x,y+0.85,4.0,0.55,nm,col,fs=9)
        ax.text(x+2.0,y+0.35,desc,ha="center",va="center",fontsize=7,color=C["slate"],style="italic")
    return save_fig(fig,"ATL-IDN-001")

def d_IDN_002():
    fig,ax=plt.subplots(figsize=(10,8))
    clean(fig,ax,"Identity Bounded Context — DDD Tactical Model")
    sbox(ax,3.0,8.0,4.0,1.0,"Research Identity\n(Aggregate Root)",C["navy"],fs=11)
    for x,y,nm in [(0.3,6.0,"Research\nAgenda"),(2.6,6.0,"Research\nArea"),
                    (4.9,6.0,"Research\nQuestion"),(7.2,6.0,"Research\nDossier")]:
        sbox(ax,x,y,2.0,0.9,nm,C["steel"],fs=8)
        arr(ax,x+1.0,y+0.9,5.0,8.0,C["mid_gray"])
    for x,y,nm in [(0.5,4.0,"Confidence\nLevel"),(3.0,4.0,"Research\nStage"),
                    (5.5,4.0,"Verification\nStatus"),(8.0,4.0,"Semantic\nTag")]:
        sbox(ax,x,y,1.8,0.8,nm,C["amber"],fs=7,wt="normal")
    sbox(ax,0.5,2.2,4.0,0.8,"Identity Consistency Service",C["emerald"],fs=8,wt="normal")
    sbox(ax,5.5,2.2,4.0,0.8,"Semantic Validation Service",C["emerald"],fs=8,wt="normal")
    return save_fig(fig,"ATL-IDN-002")

def d_IDN_003():
    fig,ax=plt.subplots(figsize=(10,6))
    clean(fig,ax,"Identity Lifecycle — From Vision to Established Identity")
    ss=[(1.0,"Emerging\nIdentity",C["sky"]),(3.0,"Developing\nIdentity",C["accent"]),
        (5.0,"Established\nIdentity",C["steel"]),(7.0,"Evolving\nIdentity",C["navy"]),
        (9.0,"Legacy\nIdentity",C["deep_blue"])]
    for x,nm,col in ss:
        sbox(ax,x-0.8,4.0,1.6,1.5,nm,col,fs=9)
    for i in range(len(ss)-1):
        arr(ax,ss[i][0]+0.8,4.75,ss[i+1][0]-0.8,4.75,lw=2)
    ax.annotate("",xy=(1.0,3.5),xytext=(9.0,3.5),
                arrowprops=dict(arrowstyle="-|>",color=C["accent"],lw=1.5,
                                connectionstyle="arc3,rad=-0.3",linestyle="--"))
    ax.text(5.0,2.8,"Continuous Feedback Loop — Identity strengthens through iteration",
            ha="center",fontsize=8,color=C["gray"],style="italic")
    return save_fig(fig,"ATL-IDN-003")

def d_IDN_004():
    fig,ax=plt.subplots(figsize=(12,8))
    clean(fig,ax,"Identity Entity-Relationship Diagram")
    sbox(ax,3.5,6.5,3.0,1.2,"Research Identity",C["navy"],fs=12)
    es=[(0.5,4.5,"Research\nAgenda","1:N",C["steel"]),(0.5,2.0,"Research\nArea","1:N",C["steel"]),
        (3.5,2.0,"Research\nQuestion","1:N",C["teal"]),(6.5,4.5,"Research\nDossier","1:1",C["accent"]),
        (6.5,2.0,"Evolution\nRecord","1:N",C["purple"])]
    for x,y,nm,card,col in es:
        sbox(ax,x,y,2.0,1.0,nm,col,fs=8)
        ax.annotate("",xy=(x+1.0,y+0.8),xytext=(5.0,7.1),
                    arrowprops=dict(arrowstyle="-",color=C["mid_gray"],lw=1.2))
        mx=(x+1.0+5.0)/2; my=(y+0.8+7.1)/2
        ax.text(mx,my,card,ha="center",va="center",fontsize=8,color=C["gray"],fontweight="bold",
                bbox=dict(boxstyle="round,pad=0.1",facecolor=C["white"],edgecolor="none"))
    return save_fig(fig,"ATL-IDN-004")

def d_IDN_005():
    fig,ax=plt.subplots(figsize=(10,9))
    clean(fig,ax,"Identity Architecture Blueprint — Nine Layers")
    ls=[("Layer 1","Purpose","Why Identity exists",C["navy"]),
        ("Layer 2","Vocabulary","Domain terminology",C["emerald"]),
        ("Layer 3","Ontology","Conceptual worldview",C["accent"]),
        ("Layer 4","Value Objects","Immutable descriptors",C["steel"]),
        ("Layer 5","Entities","Persistent domain objects",C["teal"]),
        ("Layer 6","Relationships","Semantic connections",C["amber"]),
        ("Layer 7","Invariants","IC-001 to IC-006",C["rose"]),
        ("Layer 8","Verification Rules","Conformance criteria",C["purple"]),
        ("Layer 9","Identity Interface","Exposes capabilities",C["slate"])]
    y=1.0
    for lay,nm,desc,col in ls:
        sbox(ax,0.5,y,9.0,0.8,"",col,alpha=0.15,ec=col)
        ax.text(1.0,y+0.4,lay,ha="left",va="center",fontsize=8,color=col,fontweight="bold")
        ax.text(3.0,y+0.4,nm,ha="left",va="center",fontsize=10,color=col,fontweight="bold")
        ax.text(6.5,y+0.4,desc,ha="left",va="center",fontsize=8,color=C["gray"],style="italic")
        y+=0.9
    return save_fig(fig,"ATL-IDN-005")

def d_IDN_006():
    fig,ax=plt.subplots(figsize=(10,7))
    clean(fig,ax,"Identity Context Map — Upstream/Downstream Relationships")
    sbox(ax,3.0,5.5,4.0,1.5,"Identity\n(Upstream Core)",C["navy"],fs=12)
    for x,y,nm,col in [(0.5,3.0,"Knowledge\n(Downstream)",C["teal"]),
                        (3.5,3.0,"Communication\n(Downstream)",C["emerald"]),
                        (6.5,3.0,"Visualization\n(Downstream)",C["accent"])]:
        sbox(ax,x,y,2.5,1.2,nm,col,fs=9)
        arr(ax,x+1.25,y+1.2,5.0,5.5,lw=1.5)
    sbox(ax,2.0,0.8,2.5,1.0,"Motion\n(Supporting)",C["purple"],fs=8)
    sbox(ax,5.5,0.8,2.5,1.0,"Engineering\n(Supporting)",C["slate"],fs=8)
    return save_fig(fig,"ATL-IDN-006")

def d_IDN_007():
    fig,ax=plt.subplots(figsize=(10,7))
    clean(fig,ax,"Identity Capability Map")
    cs=[(0.5,7.0,"Define\nResearch Identity",C["navy"]),(3.5,7.0,"Manage\nResearch Agenda",C["deep_blue"]),
        (6.5,7.0,"Track\nResearch Areas",C["steel"]),(0.5,4.5,"Build\nDossier",C["teal"]),
        (3.5,4.5,"Verify\nIdentity",C["emerald"]),(6.5,4.5,"Track\nEvolution",C["accent"]),
        (0.5,2.0,"Validate\nSemantics",C["purple"]),(3.5,2.0,"Expose\nInterface",C["slate"])]
    for x,y,nm,col in cs:
        sbox(ax,x,y,2.8,1.8,"",col,alpha=0.08,ec=col)
        sbox(ax,x,y+0.9,2.8,0.6,nm,col,fs=8)
        ax.text(x+1.4,y+0.4,"capability",ha="center",fontsize=6,color=C["gray"],style="italic")
    return save_fig(fig,"ATL-IDN-007")

def d_IDN_008():
    fig,ax=plt.subplots(figsize=(10,6))
    clean(fig,ax,"Identity Domain Dependencies")
    sbox(ax,3.0,4.5,4.0,1.2,"Identity Domain",C["navy"],fs=12)
    ups=[("No upstream\ndependencies",C["emerald"])]
    downs=[(0.5,2.5,"Knowledge",C["teal"]),(3.0,2.5,"Communication",C["emerald"]),
           (5.5,2.5,"Visualization",C["accent"]),(8.0,2.5,"Motion",C["purple"]),
           (1.5,0.5,"Engineering",C["slate"]),(6.5,0.5,"Evolution",C["gray"])]
    for x,y,nm,col in downs:
        sbox(ax,x,y,2.0,0.8,nm,col,fs=8)
        arr(ax,5.0,4.5,x+1.0,y+0.8,lw=1.2)
    sbox(ax,3.5,7.5,3.0,0.6,"No upstream dependencies",C["emerald"],fs=8)
    arr(ax,5.0,7.5,5.0,5.7,C["emerald"])
    ax.text(5.0,8.5,"Identity depends on nothing. Everything depends on Identity.",
            ha="center",fontsize=9,color=C["navy"],fontweight="bold",style="italic")
    return save_fig(fig,"ATL-IDN-008")

def d_IDN_009():
    fig,ax=plt.subplots(figsize=(10,8))
    clean(fig,ax,"Identity DDD Diagram — Tactical Patterns")
    sbox(ax,3.0,8.5,4.0,0.8,"Research Identity\n(Aggregate Root)",C["navy"],fs=11)
    ents=[(0.3,6.5,"Research Agenda (Entity)",C["steel"]),(3.5,6.5,"Research Area (Entity)",C["steel"]),
          (6.7,6.5,"Research Question (Entity)",C["steel"]),(0.3,5.0,"Research Dossier (Entity)",C["steel"]),
          (3.5,5.0,"Evolution Record (Entity)",C["steel"])]
    for x,y,nm,col in ents:
        sbox(ax,x,y,2.8,0.7,nm,col,fs=7)
    vos=[(0.3,3.5,"Confidence Level (VO)",C["amber"]),(3.5,3.5,"Research Stage (VO)",C["amber"]),
         (6.7,3.5,"Verification Status (VO)",C["amber"])]
    for x,y,nm,col in vos:
        sbox(ax,x,y,2.8,0.7,nm,col,fs=7,wt="normal")
    evts=[(0.3,2.0,"IdentityCreated (Event)",C["gold"]),(3.5,2.0,"AgendaUpdated (Event)",C["gold"]),
          (6.7,2.0,"IdentityVerified (Event)",C["gold"])]
    for x,y,nm,col in evts:
        sbox(ax,x,y,2.8,0.7,nm,col,fs=7,wt="normal")
    svcs=[(1.0,0.8,"Identity Consistency Service",C["emerald"]),(5.5,0.8,"Semantic Validation Service",C["emerald"])]
    for x,y,nm,col in svcs:
        sbox(ax,x,y,3.5,0.7,nm,col,fs=7,wt="normal")
    return save_fig(fig,"ATL-IDN-009")

def d_IDN_010():
    fig,ax=plt.subplots(figsize=(10,7))
    clean(fig,ax,"Identity Business Rules — Invariant Constraints")
    sbox(ax,3.0,8.5,4.0,0.6,"Identity Invariants (IC-001 to IC-006)",C["navy"],fs=11)
    ics=[("IC-001","Research Identity SHALL be derived from evidence","Critical",C["red"]),
         ("IC-002","Research Agenda SHALL have at least one Research Area","Critical",C["red"]),
         ("IC-003","Research Area SHALL contain at least one Research Question","High",C["amber"]),
         ("IC-004","Identity SHALL NOT be defined by self-description","Critical",C["red"]),
         ("IC-005","Identity SHALL preserve semantic integrity","Critical",C["red"]),
         ("IC-006","Evolution SHALL strengthen coherence","High",C["amber"])]
    y=7.5
    for i,(ic,desc,sev,col) in enumerate(ics):
        bg=C["light_blue"] if i%2==0 else C["white"]
        sbox(ax,0.3,y,1.2,0.6,ic,bg,C["navy"],fs=8,ec=C["mid_gray"])
        sbox(ax,1.6,y,6.0,0.6,desc,bg,C["black"],fs=7,wt="normal",ec=C["mid_gray"])
        sbox(ax,7.7,y,2.0,0.6,sev,C["white"],col,fs=7,ec=col)
        y-=0.8
    ax.text(5.0,y-0.3,"Violation of any invariant constitutes architectural non-conformance.",
            ha="center",fontsize=8,color=C["gray"],style="italic")
    return save_fig(fig,"ATL-IDN-010")

def d_IDN_011():
    fig,ax=plt.subplots(figsize=(10,5))
    clean(fig,ax,"Identity Verification Flow")
    ss=["Submit\nEvidence","Extract\nClaims","Validate\nSemantics","Check\nInvariants","Update\nIdentity"]
    xs=[1.0,3.0,5.0,7.0,9.0]
    for i,(x,nm) in enumerate(zip(xs,ss)):
        sbox(ax,x-0.7,3.5,1.4,1.5,nm,C["navy"] if i==0 else C["steel"] if i<3 else C["emerald"],fs=8)
        if i<len(ss)-1:
            arr(ax,x+0.7,4.25,xs[i+1]-0.7,4.25,lw=2)
    ax.text(5.0,2.5,"Verification is continuous. Identity is never final — it evolves with evidence.",
            ha="center",fontsize=8,color=C["gray"],style="italic")
    return save_fig(fig,"ATL-IDN-011")

def d_IDN_012():
    fig,ax=plt.subplots(figsize=(10,7))
    clean(fig,ax,"Identity Interaction Diagram — Cross-Domain Flows")
    sbox(ax,3.0,5.5,4.0,1.2,"Identity\nDomain",C["navy"],fs=12)
    interact=[(0.5,3.0,"Knowledge\nDomain","Provides evidence\n& claims",C["teal"],"→"),
              (5.5,3.0,"Communication\nDomains","Consumes identity\nfor narrative",C["emerald"],"←"),
              (0.5,1.0,"Visualization\nDomain","Renders identity\ngraphs",C["accent"],"←"),
              (5.5,1.0,"Motion\nDomain","Tracks identity\nevolution",C["purple"],"↔")]
    for x,y,nm,desc,col,direc in interact:
        sbox(ax,x,y,3.0,1.5,"",col,alpha=0.08,ec=col)
        sbox(ax,x,y+1.0,3.0,0.5,nm,col,fs=8)
        ax.text(x+1.5,y+0.5,desc,ha="center",va="center",fontsize=6,color=C["slate"],style="italic")
    return save_fig(fig,"ATL-IDN-012")

# ── KNOWLEDGE DIAGRAMS ──────────────────────────────────────────────

def d_KNO_001():
    fig,ax=plt.subplots(figsize=(10,8))
    clean(fig,ax,"Knowledge Domain — Eight Components")
    sbox(ax,3.0,9.0,4.0,0.6,"Knowledge Domain (KNO)",C["teal"],fs=12)
    cs=[(0.5,7.0,"Knowledge Claims","Primary assertions\nfrom evidence",C["teal"]),
        (5.5,7.0,"Concept System","Formal concept\ndefinitions",C["emerald"]),
        (0.5,5.0,"Evidence Framework","Evidence collection\n& validation",C["navy"]),
        (5.5,5.0,"Ontology Engine","Semantic\nrelationships",C["steel"]),
        (0.5,3.0,"Reasoning Chain","Logical inference\npaths",C["accent"]),
        (5.5,3.0,"Knowledge Graph","Visual knowledge\nnetwork",C["purple"]),
        (0.5,1.0,"Knowledge Lifecycle","Claim states\n& transitions",C["amber"]),
        (5.5,1.0,"Knowledge Interfaces","External access\nto knowledge",C["slate"])]
    for x,y,nm,desc,col in cs:
        sbox(ax,x,y,4.0,1.4,"",col,alpha=0.08,ec=col)
        sbox(ax,x,y+0.85,4.0,0.55,nm,col,fs=9)
        ax.text(x+2.0,y+0.35,desc,ha="center",va="center",fontsize=7,color=C["slate"],style="italic")
    return save_fig(fig,"ATL-KNO-001")

def d_KNO_002():
    fig,ax=plt.subplots(figsize=(10,8))
    clean(fig,ax,"Knowledge Bounded Context — DDD Tactical Model")
    sbox(ax,3.0,8.0,4.0,1.0,"Knowledge Base\n(Aggregate Root)",C["teal"],fs=11)
    ents=[(0.3,6.0,"Concept",C["steel"]),(2.2,6.0,"Claim",C["steel"]),
          (4.1,6.0,"Evidence\nItem",C["steel"]),(6.0,6.0,"Reasoning\nChain",C["steel"]),
          (7.9,6.0,"Ontology\nTerm",C["steel"])]
    for x,y,nm,_ in ents:
        sbox(ax,x,y,1.6,0.9,nm,C["steel"],fs=7)
    vos=[(0.5,4.0,"Confidence\nLevel",C["amber"]),(3.0,4.0,"Knowledge\nVersion",C["amber"]),
         (5.5,4.0,"Evidence\nType",C["amber"]),(8.0,4.0,"Relation\nType",C["amber"])]
    for x,y,nm,_ in vos:
        sbox(ax,x,y,1.8,0.8,nm,C["amber"],fs=7,wt="normal")
    sbox(ax,0.5,2.2,4.0,0.8,"Knowledge Consistency Service",C["emerald"],fs=8,wt="normal")
    sbox(ax,5.5,2.2,4.0,0.8,"Ontology Validation Service",C["emerald"],fs=8,wt="normal")
    return save_fig(fig,"ATL-KNO-002")

def d_KNO_003():
    fig,ax=plt.subplots(figsize=(10,6))
    clean(fig,ax,"Knowledge Lifecycle — Five States")
    ss=[(1.0,"Hypothesis",C["sky"]),(3.0,"Investigation",C["accent"]),
        (5.0,"Evidence\nGathering",C["steel"]),(7.0,"Validated\nKnowledge",C["emerald"]),
        (9.0,"Disseminated\nKnowledge",C["teal"])]
    for x,nm,col in ss:
        sbox(ax,x-0.8,4.0,1.6,1.5,nm,col,fs=9)
    for i in range(len(ss)-1):
        arr(ax,ss[i][0]+0.8,4.75,ss[i+1][0]-0.8,4.75,lw=2)
    ax.annotate("",xy=(1.0,3.5),xytext=(9.0,3.5),
                arrowprops=dict(arrowstyle="-|>",color=C["accent"],lw=1.5,
                                connectionstyle="arc3,rad=-0.3",linestyle="--"))
    ax.text(5.0,2.8,"The lifecycle is circular — evidence strengthens through iteration",
            ha="center",fontsize=8,color=C["gray"],style="italic")
    return save_fig(fig,"ATL-KNO-003")

def d_KNO_004():
    fig,ax=plt.subplots(figsize=(12,8))
    clean(fig,ax,"Knowledge Entity-Relationship Diagram")
    sbox(ax,3.5,6.5,3.0,1.2,"Knowledge Base",C["teal"],fs=12)
    es=[(0.5,4.5,"Concept","1:N",C["steel"]),(0.5,2.0,"Claim","1:N",C["steel"]),
        (3.5,2.0,"Evidence","1:N",C["emerald"]),(6.5,4.5,"Reasoning\nChain","1:N",C["accent"]),
        (6.5,2.0,"Ontology\nTerm","1:N",C["purple"])]
    for x,y,nm,card,col in es:
        sbox(ax,x,y,2.0,1.0,nm,col,fs=8)
        ax.annotate("",xy=(x+1.0,y+0.8),xytext=(5.0,7.1),
                    arrowprops=dict(arrowstyle="-",color=C["mid_gray"],lw=1.2))
        mx=(x+1.0+5.0)/2; my=(y+0.8+7.1)/2
        ax.text(mx,my,card,ha="center",va="center",fontsize=8,color=C["gray"],fontweight="bold",
                bbox=dict(boxstyle="round,pad=0.1",facecolor=C["white"],edgecolor="none"))
    ax.text(5.0,0.8,"Every claim MUST reference supporting evidence. Confidence is a value object.",
            ha="center",fontsize=8,color=C["gray"],style="italic")
    return save_fig(fig,"ATL-KNO-004")

def d_KNO_005():
    fig,ax=plt.subplots(figsize=(10,8))
    clean(fig,ax,"Knowledge DDD Diagram — Tactical Patterns")
    sbox(ax,3.0,8.5,4.0,0.8,"Knowledge Base\n(Aggregate Root)",C["teal"],fs=11)
    ents=[(0.3,7.0,"Concept (Entity)",C["steel"]),(3.5,7.0,"Claim (Entity)",C["steel"]),
          (6.7,7.0,"Evidence (Entity)",C["steel"]),(0.3,5.5,"Reasoning Chain (Entity)",C["steel"]),
          (3.5,5.5,"Ontology Term (Entity)",C["steel"])]
    for x,y,nm,col in ents:
        sbox(ax,x,y,2.8,0.7,nm,col,fs=7)
    vos=[(0.3,4.0,"Confidence Level (VO)",C["amber"]),(3.5,4.0,"Knowledge Version (VO)",C["amber"]),
         (6.7,4.0,"Evidence Type (VO)",C["amber"]),(0.3,3.0,"Relation Type (VO)",C["amber"])]
    for x,y,nm,col in vos:
        sbox(ax,x,y,2.8,0.7,nm,col,fs=7,wt="normal")
    svcs=[(1.0,1.5,"Knowledge Consistency Service",C["emerald"]),
          (5.5,1.5,"Ontology Validation Service",C["emerald"])]
    for x,y,nm,col in svcs:
        sbox(ax,x,y,3.5,0.7,nm,col,fs=7,wt="normal")
    return save_fig(fig,"ATL-KNO-005")

def d_KNO_006():
    fig,ax=plt.subplots(figsize=(10,7))
    clean(fig,ax,"Research Lifecycle — Seven Stages")
    ss=[(1.0,"Research\nQuestion",C["navy"]),(3.0,"Hypothesis",C["teal"]),
        (5.0,"Experiment\nDesign",C["emerald"]),(7.0,"Data\nCollection",C["steel"]),
        (9.0,"Analysis &\nReasoning",C["accent"]),(1.0,"Knowledge\nClaim",C["purple"]),
        (5.0,"Publication &\nDissemination",C["amber"])]
    for x,nm,col in ss:
        sbox(ax,x-0.7,4.5,1.4,1.2,nm,col,fs=8)
    # simplified flow
    for i in range(4):
        arr(ax,ss[i][0]+0.7,5.1,ss[i+1][0]-0.7,5.1,lw=1.5)
    arr(ax,ss[4][0]+0.7,5.1,5.0,5.1,lw=1.5)
    arr(ax,5.0,4.5,1.0,4.5,lw=1.5,col=C["accent"])
    ax.text(5.0,3.5,"The lifecycle is iterative, not linear. Evidence connects all stages.",
            ha="center",fontsize=8,color=C["gray"],style="italic")
    return save_fig(fig,"ATL-KNO-006")

def d_KNO_007():
    fig,ax=plt.subplots(figsize=(10,5))
    clean(fig,ax,"Knowledge Evolution Timeline")
    ms=["Initial\nQuestion","First\nHypothesis","Evidence\nGathering","First\nClaim",
        "Validated\nKnowledge","Published\nFinding","Knowledge\nTransfer"]
    xs=[0.8,2.2,3.6,5.0,6.4,7.8,9.2]
    for x,nm in zip(xs,ms):
        circ=plt.Circle((x,4.5),0.4,color=C["teal"],zorder=5)
        ax.add_patch(circ)
        ax.text(x,4.5,nm,ha="center",va="center",fontsize=6,color="white",fontweight="bold",zorder=6)
        ax.text(x,3.5,nm,ha="center",va="center",fontsize=6,color=C["gray"])
    ax.plot(xs,[4.5]*len(xs),color=C["mid_gray"],lw=3,zorder=1)
    ax.text(5.0,2.5,"Knowledge complexity increases over time. Growth accelerates.",
            ha="center",fontsize=8,color=C["gray"],style="italic")
    return save_fig(fig,"ATL-KNO-007")

def d_KNO_008():
    fig,ax=plt.subplots(figsize=(10,7))
    clean(fig,ax,"Academic Trust Model — Trust Pyramid")
    levels=[("Identity Coherence",C["navy"],1.0),("Research Consistency",C["deep_blue"],2.5),
            ("Methodological Rigor",C["steel"],4.0),("Evidence Base",C["teal"],5.5),
            ("Publication Record",C["emerald"],7.0),("Recognition & Impact",C["accent"],8.5)]
    for i,(nm,col,w) in enumerate(levels):
        y=1.0+i*1.1
        x=5.0-w
        sbox(ax,x,y,w*2,0.9,nm,col,fs=9)
    ax.text(5.0,9.5,"Trust builds from bottom to top. Each level depends on lower levels.",
            ha="center",fontsize=8,color=C["gray"],style="italic")
    return save_fig(fig,"ATL-KNO-008")

# ── COMMUNICATION DIAGRAMS ──────────────────────────────────────────

def d_COM_001():
    fig,ax=plt.subplots(figsize=(10,8))
    clean(fig,ax,"Knowledge Communication Domain — Eight Components")
    sbox(ax,2.5,9.0,5.0,0.6,"Knowledge Communication Domain",C["emerald"],fs=12)
    cs=[(0.5,7.0,"Narrative Engine","Core storytelling\nlogic",C["emerald"]),
        (5.5,7.0,"Story Framework","Narrative\nstructure",C["teal"]),
        (0.5,5.0,"Research Narrative","Scientific\nstorytelling",C["steel"]),
        (5.5,5.0,"Audience Model","Target audience\nprofiling",C["accent"]),
        (0.5,3.0,"Communication Strategy","Channel &\nfrequency planning",C["navy"]),
        (5.5,3.0,"Knowledge Translation","Expert to\naccessible",C["purple"]),
        (0.5,1.0,"Engagement Design","Interaction\npatterns",C["amber"]),
        (5.5,1.0,"Impact Tracking","Measuring\ncommunication impact",C["slate"])]
    for x,y,nm,desc,col in cs:
        sbox(ax,x,y,4.0,1.4,"",col,alpha=0.08,ec=col)
        sbox(ax,x,y+0.85,4.0,0.55,nm,col,fs=9)
        ax.text(x+2.0,y+0.35,desc,ha="center",va="center",fontsize=7,color=C["slate"],style="italic")
    return save_fig(fig,"ATL-COM-001")

def d_COM_002():
    fig,ax=plt.subplots(figsize=(10,8))
    clean(fig,ax,"Scholarly Communication Domain — Eight Components")
    sbox(ax,2.5,9.0,5.0,0.6,"Scholarly Communication Domain",C["steel"],fs=12)
    cs=[(0.5,7.0,"Publication Lifecycle","Submission to\npublication",C["steel"]),
        (5.5,7.0,"Peer Review\nFramework","Review process\nmanagement",C["navy"]),
        (0.5,5.0,"Citation Management","Citation tracking\n& formatting",C["teal"]),
        (5.5,5.0,"Impact Measurement","Citation metrics\n& h-index",C["emerald"]),
        (0.5,3.0,"Academic Profile","Researcher\nidentity display",C["accent"]),
        (5.5,3.0,"Venue Strategy","Journal &\nconference selection",C["purple"]),
        (0.5,1.0,"Open Access\nManagement","OA policies\n& compliance",C["green"]),
        (5.5,1.0,"Scholarly Reputation","Reputation\nbuilding",C["amber"])]
    for x,y,nm,desc,col in cs:
        sbox(ax,x,y,4.0,1.4,"",col,alpha=0.08,ec=col)
        sbox(ax,x,y+0.85,4.0,0.55,nm,col,fs=9)
        ax.text(x+2.0,y+0.35,desc,ha="center",va="center",fontsize=7,color=C["slate"],style="italic")
    return save_fig(fig,"ATL-COM-002")

# ── VISUALIZATION DIAGRAM ───────────────────────────────────────────

def d_VIS_001():
    fig,ax=plt.subplots(figsize=(10,8))
    clean(fig,ax,"Scientific Visualization Domain — Eight Components")
    sbox(ax,2.5,9.0,5.0,0.6,"Scientific Visualization Domain",C["accent"],fs=12)
    cs=[(0.5,7.0,"Knowledge Graphs","Semantic\nrelationship maps",C["accent"]),
        (5.5,7.0,"Concept Maps","Conceptual\ndiagrams",C["steel"]),
        (0.5,5.0,"Ontology Diagrams","Formal ontology\nvisualization",C["teal"]),
        (5.5,5.0,"Research Dashboards","Real-time\nmetrics",C["emerald"]),
        (0.5,3.0,"Timeline Visualizations","Temporal\nprogression",C["purple"]),
        (5.5,3.0,"Citation Networks","Reference\nmapping",C["navy"]),
        (0.5,1.0,"Impact Visualizations","Research\nimpact display",C["amber"]),
        (5.5,1.0,"Architecture Diagrams","System\narchitecture",C["slate"])]
    for x,y,nm,desc,col in cs:
        sbox(ax,x,y,4.0,1.4,"",col,alpha=0.08,ec=col)
        sbox(ax,x,y+0.85,4.0,0.55,nm,col,fs=9)
        ax.text(x+2.0,y+0.35,desc,ha="center",va="center",fontsize=7,color=C["slate"],style="italic")
    return save_fig(fig,"ATL-VIS-001")

# ── MOTION DIAGRAM ──────────────────────────────────────────────────

def d_MOT_001():
    fig,ax=plt.subplots(figsize=(10,8))
    clean(fig,ax,"Cognitive Motion Domain — Eight Components")
    sbox(ax,3.0,9.0,4.0,0.6,"Cognitive Motion Domain",C["purple"],fs=12)
    cs=[(0.5,7.0,"Research Direction","Strategic\nresearch path",C["purple"]),
        (5.5,7.0,"Intellectual Momentum","Research\nvelocity",C["navy"]),
        (0.5,5.0,"Trajectory Modeling","Future research\npath prediction",C["steel"]),
        (5.5,5.0,"Evolution Tracking","Change\nmonitoring",C["teal"]),
        (0.5,3.0,"Milestone Management","Research\nachievements",C["emerald"]),
        (5.5,3.0,"Transition Reasoning","Why direction\nchanged",C["accent"]),
        (0.5,1.0,"Continuity Preservation","Maintaining\ncoherence",C["amber"]),
        (5.5,1.0,"Future Projection","Research\nforecasting",C["slate"])]
    for x,y,nm,desc,col in cs:
        sbox(ax,x,y,4.0,1.4,"",col,alpha=0.08,ec=col)
        sbox(ax,x,y+0.85,4.0,0.55,nm,col,fs=9)
        ax.text(x+2.0,y+0.35,desc,ha="center",va="center",fontsize=7,color=C["slate"],style="italic")
    return save_fig(fig,"ATL-MOT-001")

# ── ENGINEERING DIAGRAMS ────────────────────────────────────────────

def d_ENG_001():
    fig,ax=plt.subplots(figsize=(10,8))
    clean(fig,ax,"Platform Engineering Domain — Eight Components")
    sbox(ax,3.0,9.0,4.0,0.6,"Platform Engineering Domain",C["slate"],fs=12)
    cs=[(0.5,7.0,"Service Architecture","Microservice\ndesign",C["slate"]),
        (5.5,7.0,"API Gateway","Request routing\n& auth",C["steel"]),
        (0.5,5.0,"Database Layer","Persistent\nstorage",C["teal"]),
        (5.5,5.0,"Search Engine","Full-text &\nsemantic search",C["emerald"]),
        (0.5,3.0,"Auth System","Authentication\n& authorization",C["navy"]),
        (5.5,3.0,"Caching Layer","Performance\noptimization",C["accent"]),
        (0.5,1.0,"Event Bus","Async\ncommunication",C["purple"]),
        (5.5,1.0,"Observability Stack","Monitoring &\nlogging",C["amber"])]
    for x,y,nm,desc,col in cs:
        sbox(ax,x,y,4.0,1.4,"",col,alpha=0.08,ec=col)
        sbox(ax,x,y+0.85,4.0,0.55,nm,col,fs=9)
        ax.text(x+2.0,y+0.35,desc,ha="center",va="center",fontsize=7,color=C["slate"],style="italic")
    return save_fig(fig,"ATL-ENG-001")

def d_ENG_002():
    fig,ax=plt.subplots(figsize=(10,9))
    clean(fig,ax,"Platform Service Architecture — Five Layers")
    ls=[("API Gateway","Rate limiting, auth, routing, load balancing",C["slate"]),
        ("Application Services","Identity, Knowledge, Publication, Visualization",C["steel"]),
        ("Domain Services","Vision, Agenda, Ontology, Narrative engines",C["teal"]),
        ("Data Layer","PostgreSQL, Elasticsearch, Redis, S3",C["emerald"]),
        ("Infrastructure","Docker, Kubernetes, Message Queue, Monitoring",C["navy"])]
    y=8.0
    for nm,desc,col in ls:
        sbox(ax,0.5,y,9.0,0.9,"",col,alpha=0.9)
        ax.text(1.0,y+0.5,nm,ha="left",va="center",fontsize=10,color="white",fontweight="bold")
        ax.text(4.0,y+0.5,desc,ha="left",va="center",fontsize=8,color=C["light_blue"],style="italic")
        y-=1.2
    ax.text(5.0,y-0.2,"Each service encapsulates a single domain concern.",ha="center",
            fontsize=8,color=C["gray"],style="italic")
    return save_fig(fig,"ATL-ENG-002")

def d_ENG_003():
    fig,ax=plt.subplots(figsize=(10,7))
    clean(fig,ax,"Infrastructure Architecture")
    layers=[("Frontend",C["accent"]),("API Gateway",C["steel"]),
            ("Application Services",C["teal"]),("Data Stores",C["emerald"]),
            ("Infrastructure",C["navy"])]
    y=8.0
    for nm,col in layers:
        sbox(ax,1.0,y,8.0,1.0,nm,col,fs=11)
        if y>3.0: arr(ax,5.0,y,5.0,y-0.2,lw=2)
        y-=1.5
    ax.text(5.0,y-0.3,"Infrastructure choices SHALL NOT influence domain semantics.",
            ha="center",fontsize=8,color=C["gray"],style="italic")
    return save_fig(fig,"ATL-ENG-003")

def d_ENG_004():
    fig,ax=plt.subplots(figsize=(10,7))
    clean(fig,ax,"Database Architecture — Six Storage Technologies")
    dbs=[(1.0,8.0,"PostgreSQL","Core relational data",C["steel"]),
         (5.0,8.0,"Elasticsearch","Full-text search",C["teal"]),
         (1.0,6.0,"Redis","Caching & sessions",C["amber"]),
         (5.0,6.0,"Object Storage","Media & blobs",C["emerald"]),
         (1.0,4.0,"Graph Database","Semantic relations",C["purple"]),
         (5.0,4.0,"Time Series DB","Metrics & monitoring",C["accent"])]
    for x,y,nm,desc,col in dbs:
        sbox(ax,x,y,3.5,1.2,"",col,alpha=0.1,ec=col)
        sbox(ax,x,y+0.7,3.5,0.5,nm,col,fs=9)
        ax.text(x+1.75,y+0.3,desc,ha="center",va="center",fontsize=7,color=C["slate"],style="italic")
    sbox(ax,2.0,2.0,6.0,0.8,"Each storage technology serves a specific architectural purpose",C["navy"],fs=8)
    return save_fig(fig,"ATL-ENG-004")

# ── IMPLEMENTATION DIAGRAMS ─────────────────────────────────────────

def d_IMP_001():
    fig,ax=plt.subplots(figsize=(10,8))
    clean(fig,ax,"Implementation Domain — Eight Components")
    sbox(ax,3.0,9.0,4.0,0.6,"Implementation Domain",C["slate"],fs=12)
    cs=[(0.5,7.0,"Repository Structure","Code organization\n& modules",C["slate"]),
        (5.5,7.0,"Development\nWorkflow","Process &\nstandards",C["steel"]),
        (0.5,5.0,"Claude Code\nIntegration","AI-first\ndevelopment",C["teal"]),
        (5.5,5.0,"Testing Framework","Unit, integration,\nconformance",C["emerald"]),
        (0.5,3.0,"CI/CD Pipeline","Build, test,\ndeploy",C["accent"]),
        (5.5,3.0,"Deployment Strategy","Dev, staging,\nproduction",C["purple"]),
        (0.5,1.0,"Monitoring\nPipeline","Observability\n& alerts",C["amber"]),
        (5.5,1.0,"Production\nArchitecture","Live system\ntopology",C["navy"])]
    for x,y,nm,desc,col in cs:
        sbox(ax,x,y,4.0,1.4,"",col,alpha=0.08,ec=col)
        sbox(ax,x,y+0.85,4.0,0.55,nm,col,fs=9)
        ax.text(x+2.0,y+0.35,desc,ha="center",va="center",fontsize=7,color=C["slate"],style="italic")
    return save_fig(fig,"ATL-IMP-001")

def d_IMP_002():
    fig,ax=plt.subplots(figsize=(10,8))
    clean(fig,ax,"Repository Layout — Project Structure")
    sbox(ax,3.5,9.0,3.0,0.6,"rios/",C["navy"],fs=12)
    dirs=["src/","tests/","docs/","config/","migrations/","infrastructure/"]
    src_dirs=["identity/","knowledge/","communication/","visualization/","motion/","platform/"]
    y=8.0
    for d in dirs:
        col=C["steel"] if d=="src/" else C["gray"]
        sbox(ax,1.0,y,2.5,0.6,d,col,fs=9,wt="normal")
        if d=="src/":
            for j,sd in enumerate(src_dirs):
                sbox(ax,4.0,y-j*0.5,2.5,0.4,sd,C["teal"],fs=7,wt="normal")
                arr(ax,3.5,y-0.3,4.0,y-j*0.5+0.2,C["mid_gray"])
        y-=0.7
    ax.text(5.0,1.5,"Each domain has its own source directory. Tests mirror source structure.",
            ha="center",fontsize=8,color=C["gray"],style="italic")
    return save_fig(fig,"ATL-IMP-002")

def d_IMP_003():
    fig,ax=plt.subplots(figsize=(10,5))
    clean(fig,ax,"Development Workflow — Six Stages")
    ss=["Architecture\nReview","Planning &\nDesign","Claude Code\nImplementation",
        "Testing &\nValidation","Conformance\nCheck","Deployment"]
    xs=[0.8,2.5,4.2,5.9,7.6,9.2]
    cols=[C["navy"],C["steel"],C["teal"],C["emerald"],C["accent"],C["purple"]]
    for i,(x,nm,col) in enumerate(zip(xs,ss,cols)):
        sbox(ax,x-0.6,3.5,1.2,1.5,nm,col,fs=7)
        if i<len(ss)-1: arr(ax,x+0.6,4.25,xs[i+1]-0.6,4.25,lw=1.5)
    ax.annotate("",xy=(0.8,3.0),xytext=(9.2,3.0),
                arrowprops=dict(arrowstyle="-|>",color=C["accent"],lw=1.5,
                                connectionstyle="arc3,rad=-0.3",linestyle="--"))
    ax.text(5.0,2.2,"Continuous feedback loop. Every implementation begins with architecture review.",
            ha="center",fontsize=8,color=C["gray"],style="italic")
    return save_fig(fig,"ATL-IMP-003")

def d_IMP_004():
    fig,ax=plt.subplots(figsize=(10,7))
    clean(fig,ax,"Deployment Architecture — Three Environments")
    envs=[(1.5,7.5,"Development","Docker Compose\nHot Reload\nLocal testing",C["teal"]),
          (5.0,7.5,"Staging","Kubernetes\nIntegration tests\nPerformance testing",C["steel"]),
          (8.5,7.5,"Production","K8s Multi-region\nCDN\nAuto-scaling",C["navy"])]
    for x,y,nm,desc,col in envs:
        sbox(ax,x-1.2,y-0.5,2.4,2.0,"",col,alpha=0.1,ec=col)
        sbox(ax,x-1.2,y+1.0,2.4,0.5,nm,col,fs=9)
        ax.text(x,y-0.1,desc,ha="center",va="center",fontsize=7,color=C["slate"],style="italic")
    arr(ax,2.7,7.5,3.8,7.5,lw=2)
    arr(ax,6.2,7.5,7.3,7.5,lw=2)
    sbox(ax,1.5,4.0,8.5,1.0,"CI/CD Pipeline: Build → Test → Lint → Security → Staging → Integration → Production",
         C["accent"],fs=8)
    return save_fig(fig,"ATL-IMP-004")

# ── REFERENCE DIAGRAMS ──────────────────────────────────────────────

def d_REF_001():
    fig,ax=plt.subplots(figsize=(10,9))
    clean(fig,ax,"Cross-Domain Dependency Map — Complete System View")
    ds={"Identity":(5.0,8.5,C["navy"]),"Knowledge":(5.0,7.0,C["teal"]),
        "Narrative":(2.0,5.5,C["emerald"]),"Publication":(8.0,5.5,C["steel"]),
        "Visualization":(5.0,4.0,C["accent"]),"Motion":(2.0,2.5,C["purple"]),
        "Engineering":(8.0,2.5,C["slate"]),"Evolution":(5.0,1.0,C["gray"])}
    for nm,(x,y,col) in ds.items():
        sbox(ax,x-1.0,y-0.4,2.0,0.8,nm,col,fs=9)
    deps=[("Identity","Knowledge"),("Knowledge","Narrative"),("Knowledge","Publication"),
          ("Identity","Narrative"),("Identity","Visualization"),("Narrative","Visualization"),
          ("Narrative","Motion"),("Visualization","Motion"),("Identity","Engineering"),
          ("Knowledge","Engineering"),("Motion","Engineering"),("Engineering","Evolution")]
    for src,dst in deps:
        sx,sy,_=ds[src]; dx,dy,_=ds[dst]
        arr(ax,sx,sy-0.4,dx,dy+0.4,lw=1.2)
    ax.text(5.0,0.2,"All dependencies flow in one direction. Identity is the architectural root.",
            ha="center",fontsize=8,color=C["gray"],style="italic")
    return save_fig(fig,"ATL-REF-001")

def d_REF_002():
    fig,ax=plt.subplots(figsize=(10,7))
    clean(fig,ax,"Strategic Context Map — DDD Context Map Pattern")
    sbox(ax,3.0,5.5,4.0,1.5,"Identity\n(Upstream Core)",C["navy"],fs=12)
    core=[(0.5,3.0,"Knowledge\n(Core)",C["teal"]),
          (5.5,3.0,"Communication\n(Core)",C["emerald"])]
    for x,y,nm,col in core:
        sbox(ax,x,y,3.0,1.2,nm,col,fs=9)
        arr(ax,x+1.5,y+1.2,5.0,5.5,lw=1.5)
    supp=[(0.5,0.8,"Visualization\n(Supporting)",C["accent"]),
          (5.5,0.8,"Motion\n(Supporting)",C["purple"]),
          (8.5,0.8,"Engineering\n(Generic)",C["slate"])]
    for x,y,nm,col in supp:
        sbox(ax,x,y,2.5,1.0,nm,col,fs=8)
    ax.text(5.0,9.0,"Context relationships follow DDD upstream/downstream patterns.",
            ha="center",fontsize=8,color=C["gray"],style="italic")
    return save_fig(fig,"ATL-REF-002")

def d_REF_003():
    fig,ax=plt.subplots(figsize=(10,7))
    clean(fig,ax,"Consumer-Provider Graph — Integration Contracts")
    provs=[(1.5,7.5,"Identity\n(Provider)",C["navy"]),
           (5.0,7.5,"Knowledge\n(Provider)",C["teal"]),
           (8.5,7.5,"Platform\n(Provider)",C["slate"])]
    cons=[(0.5,4.5,"Narrative",C["emerald"]),(3.0,4.5,"Publication",C["steel"]),
          (5.5,4.5,"Visualization",C["accent"]),(8.0,4.5,"Motion",C["purple"]),
          (2.0,2.5,"Engineering",C["slate"]),(6.0,2.5,"Implementation",C["gray"])]
    for x,y,nm,col in provs:
        sbox(ax,x-1.0,y-0.4,2.0,0.8,nm,col,fs=9)
    for x,y,nm,col in cons:
        sbox(ax,x,y,1.8,0.8,nm,col,fs=8)
    # Identity provides to most consumers
    for x,y,_,_ in cons[:4]:
        arr(ax,1.5,7.1,x+0.9,y+0.8,C["mid_gray"])
    arr(ax,8.5,7.1,6.9,3.3,C["mid_gray"])
    arr(ax,5.0,7.1,3.9,5.3,C["mid_gray"])
    arr(ax,5.0,7.1,6.4,5.3,C["mid_gray"])
    return save_fig(fig,"ATL-REF-003")

# ── MASTER DIAGRAM LIST ─────────────────────────────────────────────
DIAGRAM_GENERATORS = {
    "ATL-FOUND-001": d_FOUND_001, "ATL-FOUND-002": d_FOUND_002,
    "ATL-FOUND-003": d_FOUND_003, "ATL-FOUND-004": d_FOUND_004,
    "ATL-FOUND-005": d_FOUND_005, "ATL-FOUND-006": d_FOUND_006,
    "ATL-FOUND-007": d_FOUND_007, "ATL-FOUND-008": d_FOUND_008,
    "ATL-FOUND-009": d_FOUND_009, "ATL-FOUND-010": d_FOUND_010,
    "ATL-FOUND-011": d_FOUND_011,
    "ATL-IDN-001": d_IDN_001, "ATL-IDN-002": d_IDN_002,
    "ATL-IDN-003": d_IDN_003, "ATL-IDN-004": d_IDN_004,
    "ATL-IDN-005": d_IDN_005, "ATL-IDN-006": d_IDN_006,
    "ATL-IDN-007": d_IDN_007, "ATL-IDN-008": d_IDN_008,
    "ATL-IDN-009": d_IDN_009, "ATL-IDN-010": d_IDN_010,
    "ATL-IDN-011": d_IDN_011, "ATL-IDN-012": d_IDN_012,
    "ATL-KNO-001": d_KNO_001, "ATL-KNO-002": d_KNO_002,
    "ATL-KNO-003": d_KNO_003, "ATL-KNO-004": d_KNO_004,
    "ATL-KNO-005": d_KNO_005, "ATL-KNO-006": d_KNO_006,
    "ATL-KNO-007": d_KNO_007, "ATL-KNO-008": d_KNO_008,
    "ATL-COM-001": d_COM_001, "ATL-COM-002": d_COM_002,
    "ATL-VIS-001": d_VIS_001, "ATL-MOT-001": d_MOT_001,
    "ATL-ENG-001": d_ENG_001, "ATL-ENG-002": d_ENG_002,
    "ATL-ENG-003": d_ENG_003, "ATL-ENG-004": d_ENG_004,
    "ATL-IMP-001": d_IMP_001, "ATL-IMP-002": d_IMP_002,
    "ATL-IMP-003": d_IMP_003, "ATL-IMP-004": d_IMP_004,
    "ATL-REF-001": d_REF_001, "ATL-REF-002": d_REF_002,
    "ATL-REF-003": d_REF_003,
}