package pancakes_code;
import java.util.*;

public class StackOf {

	private ArrayList<Object> ITEMS;
	
	public StackOf(){
		ITEMS=new ArrayList<Object>();
	}
	
	public boolean isEmpty(){
		return ITEMS.isEmpty();
	}
	
	public void push(Object item){
		ITEMS.add(item);
	}
	public Object pop(){
		Object popped = ITEMS.remove(ITEMS.size()-1);
		return popped;
	}
	public Object peek(){
		return ITEMS.get(ITEMS.size()-1);
	}
	public int size(){
		return ITEMS.size();
	}
}
