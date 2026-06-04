// De onderste mobiele tabbar is bewust uitgezet: alle navigatie loopt via het
// hamburgermenu. We houden de component als no-op zodat bestaande pagina's niet
// allemaal imports/markup hoeven te wijzigen.
type BottomNavProps = {
  current?: string;
  className?: string;
};

export function BottomNav(props: BottomNavProps) {
  void props;
  return null;
}
