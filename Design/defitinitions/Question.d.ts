type ListCallback = (list:List) => void
type ChoiceCallback = (choice:Choice) => void

declare class QuestionFactory {
  list(name: string, messsage: string, list: ListCallback): this
  
}



declare class List {
  newChoice(name: string, ): void
  newChoices(names: Array<string>): void
}

declare class Choice {
  value(value: string):Choice
}

