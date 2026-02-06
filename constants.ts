import { Question, Option, EvaluationResult } from './types';

export const OPTIONS: Option[] = [
  { label: 'nie', value: 0 },
  { label: 'selten', value: 1 },
  { label: 'manchmal', value: 2 },
  { label: 'häufig', value: 3 },
  { label: 'sehr häufig', value: 4 },
];

export const QUESTIONS: Question[] = [
  { id: 1, text: 'Fällt es Ihnen schwer, mit Medien aufzuhören, wenn Sie einmal damit angefangen haben?' },
  { id: 2, text: 'Nutzen Sie Medien länger als geplant, obwohl Sie sich eigentlich etwas Anderes vorgenommen haben?' },
  { id: 3, text: 'Haben Menschen aus ihrem Umfeld schon angemerkt, dass Sie Medien zu häufig nutzen?' },
  { id: 4, text: 'Greifen Sie eher zu Medien, statt Zeit mit anderen zu verbringen?' },
  { id: 5, text: 'Schlafen Sie weniger, weil Sie Medien nutzen?' },
  { id: 6, text: 'Denken Sie auch dann an Medien, wenn Sie diese gerade nicht verwenden?' },
  { id: 7, text: 'Denken Sie darüber nach, dass Sie weniger Zeit mit Medien verbringen sollten?' },
  { id: 8, text: 'Haben Sie bereits versucht, Ihre Medienzeit zu verringern, ohne dauerhaften Erfolg?' },
  { id: 9, text: 'Erledigen Sie Aufgaben schneller oder oberflächlicher, um früher Medien nutzen zu können?' },
  { id: 10, text: 'Vernachlässigen Sie berufliche oder private Pflichten (Arbeit, Familienleben, häusliche Aufgaben, ...) zugunsten von Medien?' },
  { id: 11, text: 'Nutzen Sie Medien, wenn Sie sich niedergeschlagen fühlen?' },
  { id: 12, text: 'Greifen Sie zu Medien, um Sorgen zu entkommen oder um sich von einer negativen Stimmung zu entlasten?' },
  { id: 13, text: 'Fühlen Sie sich unruhig, frustriert oder gereizt, wenn Sie zeitweise keinen Zugang zu Medien haben?' },
];

// Based on standard IAT interpretations scaled for 13 questions (Max 52 points).
// Note: These texts are based on typical psychological self-test feedback structures.
export const EVALUATIONS: EvaluationResult[] = [
  {
    scoreRange: [0, 13],
    title: 'Unauffälliges Nutzungsverhalten',
    description: 'Ihr Ergebnis deutet darauf hin, dass Sie einen kontrollierten und bewussten Umgang mit Medien pflegen. Es liegen keine Anzeichen für ein problematisches Verhalten vor. Behalten Sie diesen bewussten Umgang bei.',
    colorClass: 'text-green-600 dark:text-green-400',
  },
  {
    scoreRange: [14, 26],
    title: 'Leichte Auffälligkeiten',
    description: 'Ihr Medienkonsum zeigt gelegentliche Tendenzen, die Aufmerksamkeit erfordern könnten. Sie haben die Kontrolle meistens, aber in bestimmten Situationen nimmt die Mediennutzung mehr Raum ein als gewollt. Eine bewusste Reflexion der Nutzungszeiten kann hilfreich sein.',
    colorClass: 'text-yellow-600 dark:text-yellow-400',
  },
  {
    scoreRange: [27, 39],
    title: 'Problematische Nutzung',
    description: 'Ihr Ergebnis weist auf ein problematisches Nutzungsverhalten hin. Die Mediennutzung beeinflusst vermutlich bereits andere Lebensbereiche wie soziale Kontakte, Arbeit oder Schlaf. Es wird empfohlen, aktive Strategien zur Reduktion der Bildschirmzeit zu entwickeln.',
    colorClass: 'text-orange-600 dark:text-orange-400',
  },
  {
    scoreRange: [40, 52],
    title: 'Starke Anzeichen für Suchtgefährdung',
    description: 'Die Auswertung zeigt deutliche Hinweise auf eine exzessive Mediennutzung, die wesentliche Lebensbereiche beeinträchtigt. Kontrollverlust und Entzugserscheinungen könnten bereits auftreten. Es ist ratsam, professionelle Beratung oder Unterstützung in Anspruch zu nehmen.',
    colorClass: 'text-red-600 dark:text-red-500',
  },
];