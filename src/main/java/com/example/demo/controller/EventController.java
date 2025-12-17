package com.example.demo.controller;

import com.example.demo.model.Event;
import com.example.demo.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// 1. Đánh dấu đây là nơi tiếp nhận yêu cầu API
@RestController
@RequestMapping("/api/events")
// 2. Mở khóa cho React (cổng 5173) truy cập vào Java
@CrossOrigin(origins = "http://localhost:5173") 
public class EventController {

    @Autowired
    private EventRepository eventRepository;

    // API 1: Lấy toàn bộ danh sách sự kiện (GET)
    @GetMapping
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    // API 2: Thêm sự kiện mới (POST)
    @PostMapping
    public Event createEvent(@RequestBody Event event) {
        // @RequestBody giúp chuyển đổi JSON từ React thành đối tượng Java
        return eventRepository.save(event);
    }

    // API 3: Xóa sự kiện theo ID (DELETE)
    @DeleteMapping("/{id}")
    public void deleteEvent(@PathVariable Long id) {
        eventRepository.deleteById(id);
    }
    // API 4: Sửa sự kiện (UPDATE)
    @PutMapping("/{id}")
    public Event updateEvent(@PathVariable Long id, @RequestBody Event eventDetails) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sự kiện id: " + id));
        
        event.setTitle(eventDetails.getTitle());
        event.setStartTime(eventDetails.getStartTime());
        event.setEndTime(eventDetails.getEndTime());
        
        return eventRepository.save(event);
    }
}