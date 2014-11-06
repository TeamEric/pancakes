package pancakes_code;
import java.util.*;

public class StackOf {

	private ArrayList<String> ITEMS;
	
	public StackOf(){
		ITEMS=new ArrayList<String>();
	}
	
	public boolean isEmpty(){
		return ITEMS.isEmpty();
	}
	
	public void push(String item){
		ITEMS.add(item);
	}
	public String pop(){
		String popped = ITEMS.remove(ITEMS.size()-1);
		return popped;
	}
	public String peek(){
		return ITEMS.get(ITEMS.size()-1);
	}
	public int size(){
		return ITEMS.size();
	}
}
