import gradient from 'gradient-string'

  const gradientNames = [
    'atlas',
    'cristal',
    'teen',
    'mind',
    'morning',
    'vice',
    'passion',
    'fruit',
    'instagram',
    'retro',
    'summer',
    'rainbow',
    'pastel'
  ]

export class Colors {
  static $ = {}

  static upAndDown(string, gradientName) {
    return gradient[gradientName]
  }

  static leftToRight(string, gradientName) {
    return gradientName[gradientName].multiline(string)
  }
}

for(const gradientName of gradientNames) {
  const g = gradient[gradientName]
  Colors[gradientName] = g
  Colors[gradientName].$ = g.multiline
}
