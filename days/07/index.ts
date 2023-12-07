import { Input } from "../../lib/input";
import Solver from "../../lib/solver";
import "../../lib/prototypes";

const cardOrder = "AKQJT98765432"
const cardOrder2 = "AKQT98765432J"

enum HandType {
	FiveOfAKind = 0,
	FourOfAKind = 1,
	FullHouse = 2,
	ThreeOfAKind = 3,
	TwoPair = 4,
	OnePair = 5,
	HighCard = 6
}

type Hand = {
	cards: string;
	type: HandType;
	bid: number;
}

function countCharacters(inputString: string): { char: string; count: number }[] {
	const charCountMap: Map<string, number> = new Map();
  
	for (const char of inputString) {
	  charCountMap.set(char, (charCountMap.get(char) || 0) + 1);
	}
  
	return [...charCountMap.entries()].map(v => ({char: v[0], count: v[1]}));
  }

function determineHandType(cards: string): HandType {
	const grouped = countCharacters(cards);
	const maxCount = Math.max(...grouped.map(v => v.count));
	if(grouped.length === 1) {
		return HandType.FiveOfAKind;
	} else if(grouped.length === 2 && maxCount === 4) {
		return HandType.FourOfAKind;
	} else if(grouped.length === 2) {
		return HandType.FullHouse;
	} else if(grouped.length === 3 && maxCount === 3) {
		return HandType.ThreeOfAKind;
	} else if(grouped.length === 3 && maxCount === 2) {
		return HandType.TwoPair;
	} else if(grouped.length === 4) {
		return HandType.OnePair;
	} else {
		return HandType.HighCard;
	}
}

function determineHandTypeWithJoker(cards: string): HandType {
	const grouped = countCharacters(cards);
	const jokerCount = grouped.find(v => v.char === "J")?.count ?? 0;
	const maxCount = Math.max(...grouped.filter(v => v.char !== "J").map(v => v.count), 0);
	const nonJokerCardsTypes = grouped.filter(v => v.char !== "J").length;
	if(maxCount + jokerCount === 5) {
		return HandType.FiveOfAKind;
	} else if(maxCount + jokerCount === 4) {
		return HandType.FourOfAKind;
	} else if(nonJokerCardsTypes === 2) {
		return HandType.FullHouse;
	} else if(maxCount + jokerCount === 3) {
		return HandType.ThreeOfAKind;
	} else if(maxCount === 2 && nonJokerCardsTypes === 3) {
		return HandType.TwoPair;
	} else if(maxCount + jokerCount === 2) {
		return HandType.OnePair;
	} else {
		return HandType.HighCard;
	}
}

function parse(line: string, handTypeDeterminer: (arg0: string) => HandType): Hand {
	const [cards, bidText] = line.split(" ");
	return {
		cards,
		type: handTypeDeterminer(cards),
		bid: Number(bidText)
	};
}

function compareHands(a: Hand, b: Hand, order: string): number {
	const typeDiff = b.type - a.type;
	if(typeDiff !== 0) {
		return typeDiff;
	}
	for(let i = 0; i < a.cards.length; i++) {
		const cardDiff = order.indexOf(b.cards[i]) - order.indexOf(a.cards[i]);
		if(cardDiff !== 0) {
			return cardDiff;
		}
	}
	return 0;
}

const values = Input.readFile().asLines().removeEmpty().parse(v => parse(v, determineHandType)).get();
const values2 = Input.readFile().asLines().removeEmpty().parse(v => parse(v, determineHandTypeWithJoker)).get();

function part1(): number | string {
	const ordered = [...values].sort((a, b) => compareHands(a, b, cardOrder));
	const strenghs = [...ordered.entries()].map(v => (v[0] + 1) * v[1].bid);
	return strenghs.sum();
}

function part2(): number | string {
	const ordered = [...values2].sort((a, b) => compareHands(a, b, cardOrder2));
	const strenghs = [...ordered.entries()].map(v => (v[0] + 1) * v[1].bid);
	return strenghs.sum();
}

Solver.create()
.setPart1(part1)
.setPart2(part2)
.solve();
	