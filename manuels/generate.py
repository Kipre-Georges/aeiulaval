# -*- coding: utf-8 -*-
"""Generate AEIULAVAL user manuals (iPhone + Android) as nice PDFs."""

from reportlab.lib.pagesizes import A4
from reportlab.lib.colors import HexColor, white, black
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle,
    KeepTogether, Flowable
)
from reportlab.lib.units import cm, mm
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

ORANGE = HexColor('#FF6B2B')
ORANGE_SOFT = HexColor('#FFE5D6')
GREEN = HexColor('#00C853')
GREEN_SOFT = HexColor('#D6F5E1')
DARK = HexColor('#1A1A1A')
DIM = HexColor('#5C5C5C')
BG_CARD = HexColor('#FAFAFA')


# --- Styles ---
styles = getSampleStyleSheet()

H1 = ParagraphStyle(
    'H1', parent=styles['Title'],
    fontName='Helvetica-Bold', fontSize=28, leading=34,
    textColor=DARK, alignment=TA_LEFT, spaceAfter=6,
)
SUBTITLE = ParagraphStyle(
    'Sub', parent=styles['Normal'],
    fontName='Helvetica', fontSize=12, leading=16,
    textColor=DIM, alignment=TA_LEFT, spaceAfter=20,
)
H2 = ParagraphStyle(
    'H2', parent=styles['Heading2'],
    fontName='Helvetica-Bold', fontSize=18, leading=22,
    textColor=DARK, alignment=TA_LEFT, spaceBefore=20, spaceAfter=12,
)
BODY = ParagraphStyle(
    'Body', parent=styles['Normal'],
    fontName='Helvetica', fontSize=11, leading=16,
    textColor=DARK, alignment=TA_LEFT, spaceAfter=8,
)
STEP_TEXT = ParagraphStyle(
    'Step', parent=styles['Normal'],
    fontName='Helvetica', fontSize=11, leading=16,
    textColor=DARK, alignment=TA_LEFT, leftIndent=0,
)
HINT = ParagraphStyle(
    'Hint', parent=styles['Normal'],
    fontName='Helvetica-Oblique', fontSize=10, leading=14,
    textColor=DIM, alignment=TA_LEFT, leftIndent=12, spaceAfter=10,
)
BADGE = ParagraphStyle(
    'Badge', parent=styles['Normal'],
    fontName='Helvetica-Bold', fontSize=9, leading=11,
    textColor=white, alignment=TA_CENTER,
)


# --- Custom flowables ---
class HeaderBanner(Flowable):
    """Colored banner with title and subtitle."""
    def __init__(self, title, subtitle, color=ORANGE, width=None):
        super().__init__()
        self.title = title
        self.subtitle = subtitle
        self.color = color
        self.w = width or (A4[0] - 4 * cm)
        self.height = 80

    def draw(self):
        c = self.canv
        c.setFillColor(self.color)
        c.roundRect(0, 0, self.w, self.height, 12, fill=1, stroke=0)
        # Three stripe icon (flag of CI: orange, white, green)
        x = 18
        y = 22
        sw = 12
        sh = self.height - 44
        c.setFillColor(HexColor('#FF6B2B'))
        c.roundRect(x, y, sw, sh, 2, fill=1, stroke=0)
        c.setFillColor(white)
        c.roundRect(x + sw + 2, y, sw, sh, 2, fill=1, stroke=0)
        c.setFillColor(GREEN)
        c.roundRect(x + 2 * (sw + 2), y, sw, sh, 2, fill=1, stroke=0)
        # Title
        c.setFillColor(white)
        c.setFont('Helvetica-Bold', 22)
        c.drawString(x + 3 * (sw + 2) + 16, self.height - 30, self.title)
        c.setFont('Helvetica', 12)
        c.drawString(x + 3 * (sw + 2) + 16, self.height - 50, self.subtitle)


class StepCard(Flowable):
    """A numbered step with title and body. Optional visual on the right."""
    def __init__(self, number, title, body_html, visual=None, width=None):
        super().__init__()
        self.number = number
        self.title = title
        self.body_html = body_html
        self.visual = visual  # callable(canvas, x, y, w, h) or None
        self.w = width or (A4[0] - 4 * cm)

        # Compute height based on text
        self.body_para = Paragraph(self.body_html, BODY)
        if self.visual:
            self.text_w = self.w - 130
        else:
            self.text_w = self.w - 70
        bw, bh = self.body_para.wrap(self.text_w, 1000)
        self.text_h = bh
        self.height = max(95, self.text_h + 45)

    def draw(self):
        c = self.canv
        # Card background
        c.setFillColor(BG_CARD)
        c.setStrokeColor(HexColor('#EAEAEA'))
        c.setLineWidth(0.6)
        c.roundRect(0, 0, self.w, self.height, 10, fill=1, stroke=1)

        # Number circle
        cx, cy = 30, self.height - 32
        c.setFillColor(ORANGE)
        c.circle(cx, cy, 17, fill=1, stroke=0)
        c.setFillColor(white)
        c.setFont('Helvetica-Bold', 16)
        # Center the digit visually
        s = str(self.number)
        text_w = c.stringWidth(s, 'Helvetica-Bold', 16)
        c.drawString(cx - text_w / 2, cy - 5, s)

        # Title
        c.setFillColor(DARK)
        c.setFont('Helvetica-Bold', 13)
        c.drawString(58, self.height - 28, self.title)

        # Body via paragraph
        self.body_para.wrapOn(c, self.text_w, 1000)
        self.body_para.drawOn(c, 58, self.height - 45 - self.text_h)

        # Optional visual on the right
        if self.visual:
            self.visual(c, self.w - 110, 10, 100, self.height - 20)


# --- Visual helpers (mini phone illustrations) ---
def phone_share_icon(c, x, y, w, h):
    """Draw a small panel that looks like the iOS Share button area."""
    c.setFillColor(white)
    c.setStrokeColor(HexColor('#D0D0D0'))
    c.setLineWidth(0.6)
    c.roundRect(x, y, w, h, 8, fill=1, stroke=1)
    # Share icon (square with arrow up)
    cx = x + w / 2
    cy = y + h / 2 + 4
    c.setStrokeColor(HexColor('#0A84FF'))
    c.setLineWidth(2)
    # Square (open top)
    c.line(cx - 10, cy - 8, cx - 10, cy + 6)
    c.line(cx + 10, cy - 8, cx + 10, cy + 6)
    c.line(cx - 10, cy - 8, cx + 10, cy - 8)
    # Arrow
    c.line(cx, cy - 5, cx, cy + 14)
    c.line(cx, cy + 14, cx - 5, cy + 9)
    c.line(cx, cy + 14, cx + 5, cy + 9)
    # Label
    c.setFillColor(DIM)
    c.setFont('Helvetica', 7)
    text_w = c.stringWidth('Partager', 'Helvetica', 7)
    c.drawString(cx - text_w / 2, y + 6, 'Partager')


def phone_add_home(c, x, y, w, h):
    """Draw the iOS 'Sur l'écran d'accueil' option line."""
    c.setFillColor(white)
    c.setStrokeColor(HexColor('#D0D0D0'))
    c.roundRect(x, y, w, h, 8, fill=1, stroke=1)
    # Plus icon
    cx = x + w / 2
    cy = y + h / 2 + 4
    c.setStrokeColor(DARK)
    c.setLineWidth(1.5)
    c.rect(cx - 11, cy - 11, 22, 22, fill=0, stroke=1)
    c.line(cx, cy - 6, cx, cy + 6)
    c.line(cx - 6, cy, cx + 6, cy)
    c.setFillColor(DIM)
    c.setFont('Helvetica', 6.5)
    c.drawCentredString(cx, y + 6, "Écran d'accueil")


def chrome_menu_icon(c, x, y, w, h):
    """Three vertical dots = Chrome menu."""
    c.setFillColor(white)
    c.setStrokeColor(HexColor('#D0D0D0'))
    c.roundRect(x, y, w, h, 8, fill=1, stroke=1)
    cx = x + w / 2
    cy = y + h / 2
    c.setFillColor(DARK)
    for i in range(-1, 2):
        c.circle(cx, cy - i * 8, 2.5, fill=1, stroke=0)
    c.setFillColor(DIM)
    c.setFont('Helvetica', 7)
    c.drawCentredString(cx, y + 6, 'Menu Chrome')


def install_button_icon(c, x, y, w, h):
    """A green install button mock."""
    c.setFillColor(white)
    c.setStrokeColor(HexColor('#D0D0D0'))
    c.roundRect(x, y, w, h, 8, fill=1, stroke=1)
    cx = x + w / 2
    cy = y + h / 2
    # Orange button
    bw, bh = 76, 26
    c.setFillColor(ORANGE)
    c.roundRect(cx - bw / 2, cy - bh / 2, bw, bh, 12, fill=1, stroke=0)
    c.setFillColor(white)
    c.setFont('Helvetica-Bold', 9)
    c.drawCentredString(cx, cy - 3, 'Akwaba')


def bell_icon(c, x, y, w, h):
    """Orange bell icon (the OneSignal subscribe button)."""
    c.setFillColor(white)
    c.setStrokeColor(HexColor('#D0D0D0'))
    c.roundRect(x, y, w, h, 8, fill=1, stroke=1)
    cx = x + w / 2
    cy = y + h / 2
    # Background circle (orange)
    c.setFillColor(ORANGE)
    c.circle(cx, cy + 2, 16, fill=1, stroke=0)
    # Bell shape (simple)
    c.setFillColor(white)
    c.setStrokeColor(white)
    c.setLineWidth(2)
    # Bell body
    c.line(cx - 6, cy + 2, cx - 6, cy + 6)
    c.line(cx + 6, cy + 2, cx + 6, cy + 6)
    c.arc(cx - 7, cy + 1, cx + 7, cy + 13, 0, 180)
    # Clapper
    c.circle(cx, cy - 3, 1.5, fill=1, stroke=0)
    c.line(cx - 7, cy + 2, cx + 7, cy + 2)


def allow_button_icon(c, x, y, w, h):
    """A browser permission prompt with Allow button."""
    c.setFillColor(white)
    c.setStrokeColor(HexColor('#D0D0D0'))
    c.roundRect(x, y, w, h, 8, fill=1, stroke=1)
    # Top prompt area
    c.setFillColor(HexColor('#F5F5F5'))
    c.roundRect(x + 6, y + h - 36, w - 12, 28, 4, fill=1, stroke=0)
    c.setFillColor(DARK)
    c.setFont('Helvetica', 7)
    c.drawString(x + 10, y + h - 18, 'Autoriser les notifications ?')
    # Allow button
    c.setFillColor(HexColor('#1A73E8'))
    c.roundRect(x + w - 54, y + 10, 44, 18, 9, fill=1, stroke=0)
    c.setFillColor(white)
    c.setFont('Helvetica-Bold', 8)
    c.drawCentredString(x + w - 32, y + 16, 'Autoriser')


# --- Header / footer ---
def page_decoration(c, doc):
    page_num = c.getPageNumber()
    # Page footer
    c.setFillColor(DIM)
    c.setFont('Helvetica', 8)
    c.drawString(2 * cm, 1.2 * cm, 'AEIULAVAL  ·  Manuel utilisateur')
    c.drawRightString(A4[0] - 2 * cm, 1.2 * cm, f'Page {page_num}')
    # Top accent bar
    c.setFillColor(ORANGE)
    c.rect(0, A4[1] - 6, A4[0], 6, fill=1, stroke=0)
    c.setFillColor(GREEN)
    c.rect(A4[0] * 2 / 3, A4[1] - 6, A4[0] / 3, 6, fill=1, stroke=0)


# --- Content builders ---
def build_iphone():
    doc = SimpleDocTemplate(
        'manuels/AEIULAVAL_iPhone.pdf', pagesize=A4,
        leftMargin=2 * cm, rightMargin=2 * cm,
        topMargin=2.2 * cm, bottomMargin=2 * cm,
        title='AEIULAVAL - Manuel iPhone',
        author='AEIULAVAL',
    )
    story = []

    story.append(HeaderBanner('Bienvenue sur iPhone', 'Tout est plus simple en deux minutes.', color=ORANGE))
    story.append(Spacer(1, 14))

    story.append(Paragraph('Akwaba !', H1))
    story.append(Paragraph(
        "Ce petit guide va te montrer comment installer l'app AEIULAVAL sur ton iPhone, "
        "et comment activer les notifications pour ne plus jamais rater un événement de la famille.",
        SUBTITLE
    ))

    # SECTION 1 - Install
    story.append(Paragraph("Partie 1 : Installer l'app sur ton écran d'accueil", H2))
    story.append(Paragraph(
        "Sur iPhone, l'installation se fait depuis Safari. Ne le fais pas dans Chrome ou Brave, "
        "Apple ne le permet pas. Ouvre simplement Safari, puis suis les étapes ci-dessous.",
        BODY
    ))
    story.append(Spacer(1, 8))

    story.append(StepCard(
        1, "Ouvre Safari et va sur le site",
        "Tape dans la barre d'adresse : <b>ivoirienlaval.netlify.app</b><br/>"
        "Attends que la page d'accueil s'affiche entièrement.",
    ))
    story.append(Spacer(1, 8))

    story.append(StepCard(
        2, "Appuie sur l'icône Partager",
        "Tu la trouves en bas de l'écran, au centre de la barre Safari. "
        "C'est un carré avec une flèche qui pointe vers le haut.",
        visual=phone_share_icon,
    ))
    story.append(Spacer(1, 8))

    story.append(StepCard(
        3, "Fais défiler et choisis « Sur l'écran d'accueil »",
        "Dans le menu qui s'ouvre, fais glisser vers le bas. "
        "Tu verras une option avec une icône <b>+</b> et le texte « Sur l'écran d'accueil ». Appuie dessus.",
        visual=phone_add_home,
    ))
    story.append(Spacer(1, 8))

    story.append(StepCard(
        4, "Confirme avec « Ajouter »",
        "Une fenêtre s'ouvre avec le nom <b>AEIULAVAL</b>. "
        "Appuie sur « Ajouter » en haut à droite. C'est tout, l'icône apparaît sur ton écran d'accueil comme une vraie app.",
    ))
    story.append(Spacer(1, 8))

    story.append(Paragraph(
        "<b>Astuce :</b> ouvre toujours l'app depuis cette nouvelle icône, pas via Safari. "
        "Cela permet de recevoir les notifications et de profiter du mode plein écran.",
        HINT
    ))

    story.append(PageBreak())

    # SECTION 2 - Notifications
    story.append(HeaderBanner('Recevoir les notifications', 'Pour ne plus rater un événement.', color=GREEN))
    story.append(Spacer(1, 14))

    story.append(Paragraph("Partie 2 : Activer les notifications", H2))
    story.append(Paragraph(
        "Sur iPhone, les notifications web fonctionnent uniquement si tu as installé l'app sur l'écran d'accueil "
        "(voir la partie 1). Une fois fait, suis ces étapes.",
        BODY
    ))
    story.append(Spacer(1, 8))

    story.append(StepCard(
        1, "Ouvre l'app depuis l'écran d'accueil",
        "Cherche l'icône AEIULAVAL (dégradé orange et vert) et appuie dessus. "
        "L'app s'ouvre en plein écran, sans la barre d'adresse Safari.",
    ))
    story.append(Spacer(1, 8))

    story.append(StepCard(
        2, "Repère la cloche orange",
        "Une <b>cloche orange</b> apparaît en bas à droite de l'écran. Elle peut mettre quelques secondes à charger.",
        visual=bell_icon,
    ))
    story.append(Spacer(1, 8))

    story.append(StepCard(
        3, "Appuie sur la cloche",
        "Un message s'ouvre pour te demander si tu veux activer les notifications. "
        "Confirme en appuyant sur <b>« M'ABONNER »</b>.",
    ))
    story.append(Spacer(1, 8))

    story.append(StepCard(
        4, "Autorise les notifications",
        "iOS te demandera une dernière confirmation. Appuie sur <b>« Autoriser »</b>. "
        "Tu recevras immédiatement une notification de bienvenue « Akwaba ! ».",
        visual=allow_button_icon,
    ))
    story.append(Spacer(1, 8))

    story.append(Paragraph(
        "<b>Astuce :</b> si tu ne vois pas la cloche, vérifie que tu as bien ouvert l'app "
        "depuis l'écran d'accueil et pas depuis Safari. Sinon, les notifications ne fonctionneront pas sur iOS.",
        HINT
    ))

    story.append(Spacer(1, 18))
    story.append(Paragraph(
        "Tu peux désactiver les notifications à tout moment dans <b>Réglages iPhone > Notifications > AEIULAVAL</b>.",
        BODY
    ))

    doc.build(story, onFirstPage=page_decoration, onLaterPages=page_decoration)


def build_android():
    doc = SimpleDocTemplate(
        'manuels/AEIULAVAL_Android.pdf', pagesize=A4,
        leftMargin=2 * cm, rightMargin=2 * cm,
        topMargin=2.2 * cm, bottomMargin=2 * cm,
        title='AEIULAVAL - Manuel Android',
        author='AEIULAVAL',
    )
    story = []

    story.append(HeaderBanner('Bienvenue sur Android', "L'installation prend moins d'une minute.", color=ORANGE))
    story.append(Spacer(1, 14))

    story.append(Paragraph('Akwaba !', H1))
    story.append(Paragraph(
        "Ce petit guide te montre comment installer AEIULAVAL sur ton téléphone Android, "
        "et activer les notifications pour rester au courant des événements en temps réel.",
        SUBTITLE
    ))

    # SECTION 1 - Install
    story.append(Paragraph("Partie 1 : Installer l'app sur ton écran d'accueil", H2))
    story.append(Paragraph(
        "Sur Android, ça marche dans Chrome, Edge, Samsung Internet et la plupart des navigateurs modernes. "
        "Le plus simple est d'utiliser Chrome.",
        BODY
    ))
    story.append(Spacer(1, 8))

    story.append(StepCard(
        1, "Ouvre Chrome et va sur le site",
        "Tape dans la barre d'adresse : <b>ivoirienlaval.netlify.app</b><br/>"
        "Laisse la page charger complètement.",
    ))
    story.append(Spacer(1, 8))

    story.append(StepCard(
        2, "Attends la popup ou ouvre le menu",
        "Après 5 secondes, une bannière « <b>La famille à portée de main</b> » apparaît en bas. "
        "Si tu ne la vois pas, appuie sur les <b>trois points</b> en haut à droite de Chrome.",
        visual=chrome_menu_icon,
    ))
    story.append(Spacer(1, 8))

    story.append(StepCard(
        3, "Lance l'installation",
        "Soit tu appuies sur le bouton <b>« Akwaba »</b> de la popup, soit tu choisis "
        "<b>« Installer l'application »</b> dans le menu Chrome.",
        visual=install_button_icon,
    ))
    story.append(Spacer(1, 8))

    story.append(StepCard(
        4, "Confirme l'installation",
        "Une fenêtre te demande de confirmer. Appuie sur <b>« Installer »</b>. "
        "L'icône AEIULAVAL apparaît immédiatement sur ton écran d'accueil et dans la liste de tes apps.",
    ))
    story.append(Spacer(1, 8))

    story.append(Paragraph(
        "<b>Astuce :</b> contrairement à iPhone, sur Android tu peux aussi utiliser le site directement dans Chrome. "
        "Mais avec l'app installée, c'est plus rapide et plus joli en plein écran.",
        HINT
    ))

    story.append(PageBreak())

    # SECTION 2 - Notifications
    story.append(HeaderBanner('Recevoir les notifications', "Sois le premier au courant.", color=GREEN))
    story.append(Spacer(1, 14))

    story.append(Paragraph("Partie 2 : Activer les notifications", H2))
    story.append(Paragraph(
        "Sur Android, pas besoin d'installer l'app pour recevoir les notifications. "
        "Ça marche directement dans Chrome ou depuis l'app installée, comme tu préfères.",
        BODY
    ))
    story.append(Spacer(1, 8))

    story.append(StepCard(
        1, "Ouvre le site ou l'app",
        "Va sur <b>ivoirienlaval.netlify.app</b> dans Chrome, ou ouvre l'icône AEIULAVAL "
        "si tu as installé l'app.",
    ))
    story.append(Spacer(1, 8))

    story.append(StepCard(
        2, "Repère la cloche orange",
        "Une <b>cloche orange</b> apparaît en bas à droite. Elle peut mettre quelques secondes à apparaître.",
        visual=bell_icon,
    ))
    story.append(Spacer(1, 8))

    story.append(StepCard(
        3, "Appuie sur la cloche puis « M'abonner »",
        "Un message s'ouvre. Appuie sur <b>« M'ABONNER »</b> pour confirmer.",
    ))
    story.append(Spacer(1, 8))

    story.append(StepCard(
        4, "Autorise les notifications",
        "Chrome te demande l'autorisation finale. Appuie sur <b>« Autoriser »</b>. "
        "Une notification de bienvenue « Akwaba ! » arrive immédiatement.",
        visual=allow_button_icon,
    ))
    story.append(Spacer(1, 8))

    story.append(Paragraph(
        "<b>Astuce :</b> si tu refuses l'autorisation par erreur, tu peux la débloquer dans "
        "<b>Paramètres Chrome > Paramètres du site > Notifications</b>, et chercher AEIULAVAL dans la liste.",
        HINT
    ))

    story.append(Spacer(1, 18))
    story.append(Paragraph(
        "Tu peux te désabonner à tout moment en appuyant à nouveau sur la cloche orange puis "
        "<b>« ME DÉSABONNER »</b>. Les notifications s'arrêtent immédiatement.",
        BODY
    ))

    doc.build(story, onFirstPage=page_decoration, onLaterPages=page_decoration)


if __name__ == '__main__':
    build_iphone()
    build_android()
    print('OK')
