package pancakes_code;


public class Main {
	
	public static void main(String[] args) {
		StackOf pancakes = new StackOf();
		pancakes.push("pancake0");
		pancakes.push("pancake1");
		pancakes.push("pancake3");
		pancakes.push("maple syrup!");
		
		while(!pancakes.isEmpty()){
			System.out.println(pancakes.pop());
		}
	}

}
